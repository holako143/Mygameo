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

      // Start a new game
      socket.on('startGame', ({ room, options, correct }) => {
        if (rooms[room]) {
          const creatorId = socket.id;
          rooms[room].game = { options, correct, creatorId };
          socket.to(room).emit('newGame', { options, creatorId });
          console.log(`Game started in room ${room} by ${creatorId}`);
        }
      });

      // Handle a guess. Database operations are removed.
      socket.on('guess', ({ room, guess }) => {
        if (rooms[room] && rooms[room].game) {
          const { game, players } = rooms[room];
          const creator = players[game.creatorId];
          const guesser = players[socket.id];

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
