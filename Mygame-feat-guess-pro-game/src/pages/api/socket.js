import { Server } from 'socket.io';
import dares from '../../lib/dares';
import aiQuestions from '../../lib/aiQuestions';

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
      socket.on('joinRoom', ({ room, user, language }) => {
        socket.join(room);
        if (!rooms[room]) {
          rooms[room] = { players: {}, game: null };
        }

        // Player data now includes points for the session
        rooms[room].players[socket.id] = { ...user, id: socket.id, language, points: 0 };

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
            image: `https://i.pravatar.cc/150?u=ai-player`,
            points: 0
          };
          io.to(room).emit('players', Object.values(rooms[room].players));

          // AI creates the game
          const question = aiQuestions[Math.floor(Math.random() * aiQuestions.length)];
          const player = rooms[room].players[socket.id];
          const options = player.language === 'ar' ? question.options.ar : question.options.en;
          const correct = question.correct;
          rooms[room].game = { options, correct, creatorId: aiId, question };
          socket.emit('newGame', { options, creatorId: aiId, question });
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

          const pointsWon = 10; // Fixed points for winning
          winner.points += pointsWon;

          // Select a dare based on the loser's language
          const loserLanguage = loser.language || 'en';
          const dareList = dares[loserLanguage];
          const randomDare = dareList[Math.floor(Math.random() * dareList.length)];

          io.to(winner.id).emit('result', { msg: { key: 'youWon', params: { points: pointsWon } } });
          io.to(loser.id).emit('result', { msg: { key: 'youLost' }, dare: randomDare });

          rooms[room].game = null;
          io.to(room).emit('players', Object.values(players));
        }
      }

      // Handle a guess. Database operations are removed.
      socket.on('guess', ({ room, guess }) => {
        handleGuess(room, guess, socket.id);
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
