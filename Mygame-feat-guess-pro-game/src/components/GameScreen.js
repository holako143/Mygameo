import { useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import Header from './Header';
import Sidebar from './Sidebar';
import ScoreBar from './ScoreBar';
import GameBox from './GameBox';
import GuessInput from './GuessInput';
import JudgmentBox from './JudgmentBox';
import ChatBox from './ChatBox';
import ShopModal from './ShopModal';
import Toast from './Toast';
import useAudio from '@/hooks/useAudio';
import DifficultyModal from './DifficultyModal';
import { motion } from 'framer-motion';

export default function GameScreen({ user }) {
  const socket = useSocket();
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState('public');
  const [sidebar, setSidebar] = useState(false);
  const [gameState, setGameState] = useState('lobby'); // lobby, creating, guessing, judgment
  const [gameData, setGameData] = useState(null);
  const [judgments, setJudgments] = useState([]);
  const [toast, setToast] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const playWinSound = useAudio('/sounds/win.wav');
  const playLoseSound = useAudio('/sounds/lose.wav');
  const playPopSound = useAudio('/sounds/pop.wav');

  useEffect(() => {
    if (!socket) return;

    // Initial setup
    socket.emit('joinRoom', { room, user });

    // Event listeners
    socket.on('players', (newList) => {
      if (newList.length > players.length) {
        playPopSound();
      }
      setPlayers(newList);
    });

    socket.on('newGame', g => {
      setGameData(g);
      // Check if this client is the creator
      if (socket.id !== g.creatorId) {
        setGameState('guessing');
      }
    });

    socket.on('result', res => {
      setToast(res.msg);
      if(res.judgments) {
        setJudgments(res.judgments);
        setGameState('judgment');
        playLoseSound();
      } else {
        // Winner
        setGameState('lobby');
        playWinSound();
      }
      setGameData(null); // Reset game data
    });

    socket.on('judgmentDone', () => {
      setJudgments([]);
      setGameState('lobby');
    });

    return () => {
        // Disconnect and clean up listeners
        if(socket) socket.disconnect();
    };
  }, [socket, room, user, playWinSound, playLoseSound]);

  const handleCreateGame = () => {
    setGameState('creating');
  }

  const handleCancelCreate = () => {
    setGameState('lobby');
  }

  const handleAiGame = (difficulty) => {
    setShowDifficultyModal(false);
    socket.emit('startAiGame', { room: 'public', difficulty });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white grid grid-rows-[auto_1fr_auto]"
    >
      <Header user={user} onMenu={() => setSidebar(!sidebar)} onShop={() => setShowShop(true)} />
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <section className="lg:col-span-2 space-y-4">
          <ScoreBar players={players} currentUserSocketId={socket?.id} />

          {gameState === 'lobby' && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="card text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateGame}
                  className="btn-primary text-2xl px-10 py-5 w-full"
                >
                  Start a New Game
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDifficultyModal(true)}
                  className="btn-secondary text-2xl px-10 py-5 w-full"
                >
                  Play with AI
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'creating' && <GameBox socket={socket} user={user} onCancel={handleCancelCreate} />}
          {gameState === 'guessing' && <GuessInput socket={socket} options={gameData?.options || []} />}
          {gameState === 'judgment' && <JudgmentBox socket={socket} judgments={judgments} />}

        </section>
        <aside>
          <ChatBox socket={socket} user={user} />
        </aside>
      </main>
      {showDifficultyModal && <DifficultyModal onSelect={handleAiGame} onCancel={() => setShowDifficultyModal(false)} />}
      {sidebar && <Sidebar players={players} onClose={() => setSidebar(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} user={user} players={players} />}
      <Toast msg={toast} onClear={() => setToast('')} />
    </motion.div>
  );
}