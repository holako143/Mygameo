import { Server } from 'socket.io';
import judgmentsData from '../../../public/judgments.json';

// Simple in-memory store for rooms and game state.
// This will reset every time the server restarts.
const rooms = {};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join a room with guest user data
      socket.on('joinRoom', ({ room, user }) => {
        socket.join(room);
        if (!rooms[room]) {
          rooms[room] = { players: {}, game: null };
        }

        // For guests, points are tracked only in memory for the current session.
        rooms[room].players[socket.id] = { ...user, id: socket.id, points: 0, bravePoints: 0 };

        io.to(room).emit('players', Object.values(rooms[room].players));
        console.log(`${user.name} joined room: ${room}`);
      });

      // Start an AI game
      socket.on('startAiGame', ({ room, difficulty }) => {
        if (rooms[room]) {
          const aiId = 'ai-player';
          rooms[room].players[aiId] = {
            id: aiId,
            name: `AI (${difficulty})`,
            points: 0,
            bravePoints: 0,
            image: `https://i.pravatar.cc/150?u=ai-player`,
          };
          io.to(room).emit('players', Object.values(rooms[room].players));

          // AI creates the game
          // TODO: Generate more interesting options
          const options = ['A', 'B', 'C'];
          const correct = Math.floor(Math.random() * 3);
          rooms[room].game = { options, correct, creatorId: aiId };
          socket.emit('newGame', { options, creatorId: aiId });
        }
      });

      // Start a new game
      socket.on('startGame', ({ room, options, correct }) => {
        if (rooms[room]) {
          const creatorId = socket.id;
          rooms[room].game = { options, correct, creatorId };
          socket.to(room).emit('newGame', { options, creatorId });
          console.log(`Game started in room ${room} by ${creatorId}`);

          // If AI is in the room, it makes a guess
          const aiPlayer = Object.values(rooms[room].players).find(p => p.id === 'ai-player');
          if (aiPlayer) {
            setTimeout(() => {
              const difficulty = aiPlayer.name.match(/\((.*)\)/)[1];
              let aiGuess;
              const random = Math.random();

              if (difficulty === 'easy' && random > 0.33) {
                aiGuess = (correct + 1) % 3;
              } else if (difficulty === 'medium' && random > 0.66) {
                aiGuess = (correct + 1) % 3;
              } else if (difficulty === 'hard' && random > 0.9) {
                aiGuess = (correct + 1) % 3;
              } else {
                aiGuess = correct;
              }

              io.to(room).emit('chat', { name: 'AI', msg: `I guess... ${options[aiGuess]}` });
              // Simulate guess from AI
              handleGuess(room, aiGuess, aiPlayer.id);
            }, 2000); // 2-second delay for realism
          }
        }
      });

      const handleGuess = (room, guess, guesserId) => {
        if (rooms[room] && rooms[room].game) {
          const { game, players } = rooms[room];
          const creator = players[game.creatorId];
          const guesser = players[guesserId];

          if (!creator || !guesser) return;

          let winner, loser;

          if (parseInt(guess, 10) === game.correct) {
            winner = guesser;
            loser = creator;
          } else {
            winner = creator;
            loser = guesser;
          }

          const pointsWon = (winner === guesser) ? 10 : 5;
          winner.points += pointsWon;

          const randomJudgments = [...judgmentsData].sort(() => 0.5 - Math.random()).slice(0, 3);

          io.to(winner.id).emit('result', { msg: `You won! You get ${pointsWon} points.` });
          io.to(loser.id).emit('result', { msg: 'You lost! Choose a judgment.', judgments: randomJudgments });

          rooms[room].game = null;
          io.to(room).emit('players', Object.values(players));
        }
      }

      // Handle a guess. Database operations are removed.
      socket.on('guess', ({ room, guess }) => {
        handleGuess(room, guess, socket.id);
      });

      // Handle judgment submission. Database operations are removed.
      socket.on('submitJudgment', ({ room }) => {
        if (rooms[room]) {
          const player = rooms[room].players[socket.id];
          if (!player) return;

          player.bravePoints += 1;

          io.to(socket.id).emit('judgmentDone');
          io.to(socket.id).emit('result', { msg: 'You earned a Brave Point!' });
          io.to(room).emit('players', Object.values(rooms[room].players));
        }
      });

      // Handle chat messages
      socket.on('chat', ({ room, name, msg }) => {
        io.to(room).emit('chat', { name, msg });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const room in rooms) {
          if (rooms[room].players[socket.id]) {
            delete rooms[room].players[socket.id];
            io.to(room).emit('players', Object.values(rooms[room].players));

            if(rooms[room].game && rooms[room].game.creatorId === socket.id) {
                rooms[room].game = null;
                io.to(room).emit('result', { msg: 'The game creator has disconnected. Game over.'});
            }

            break;
          }
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
