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
import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';
import achievements from '@/lib/achievements';
import AchievementsModal from './AchievementsModal';

export default function GameScreen({ user }) {
  const { t, language } = useContext(LanguageContext);
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
  const [showAchievements, setShowAchievements] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [wins, setWins] = useState(0);
  const [aiWins, setAiWins] = useState({ easy: 0, medium: 0, hard: 0 });
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const playWinSound = useAudio('/sounds/win.wav');
  const playLoseSound = useAudio('/sounds/lose.wav');
  const playPopSound = useAudio('/sounds/pop.wav');

  useEffect(() => {
    if (!socket) return;

    // Initial setup
    socket.emit('joinRoom', { room, user, language });

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
      setToast(t(res.msg.key, res.msg.params));
      if(res.judgments) {
        setJudgments(res.judgments);
        setGameState('judgment');
        playLoseSound();
      } else {
        // Winner
        setWins(wins + 1);
        const aiPlayer = players.find(p => p.id === 'ai-player');
        if (aiPlayer) {
          const difficulty = aiPlayer.name.match(/\((.*)\)/)[1];
          setAiWins({ ...aiWins, [difficulty]: aiWins[difficulty] + 1 });
        }
        setGameState('lobby');
        playWinSound();
      }
      setGameData(null); // Reset game data
      setShowPlayAgain(true);
    });

    socket.on('judgmentDone', () => {
      setJudgments([]);
      setGameState('lobby');
    });

    return () => {
        // Disconnect and clean up listeners
        if(socket) socket.disconnect();
    };
  }, [socket, room, user, language, playWinSound, playLoseSound, t]);

  useEffect(() => {
    const checkAchievements = () => {
      const newUnlocked = [];
      const playerStats = { wins, aiWins };
      achievements.forEach(ach => {
        if (ach.check(playerStats) && !unlockedAchievements.includes(ach.id)) {
          newUnlocked.push(ach.id);
        }
      });
      if (newUnlocked.length > 0) {
        setUnlockedAchievements([...unlockedAchievements, ...newUnlocked]);
        setToast(t('newAchievementUnlocked'));
      }
    };
    checkAchievements();
  }, [wins, aiWins, unlockedAchievements, t]);

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
      <Header user={user} onMenu={() => setSidebar(!sidebar)} onShop={() => setShowShop(true)} onAchievements={() => setShowAchievements(true)} />
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
                  {t('startNewGame')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDifficultyModal(true)}
                  className="btn-secondary text-2xl px-10 py-5 w-full"
                >
                  {t('playWithAi')}
                </motion.button>
                {showPlayAgain && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowPlayAgain(false);
                      handleCreateGame();
                    }}
                    className="btn-tertiary text-2xl px-10 py-5 w-full"
                  >
                    {t('playAgain')}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {gameState === 'creating' && <GameBox socket={socket} user={user} onCancel={handleCancelCreate} />}
          {gameState === 'guessing' && <GuessInput socket={socket} options={gameData?.options || []} question={gameData?.question} />}
          {gameState === 'judgment' && <JudgmentBox socket={socket} judgments={judgments} />}

        </section>
        <aside>
          <ChatBox socket={socket} user={user} />
        </aside>
      </main>
      {showDifficultyModal && <DifficultyModal onSelect={handleAiGame} onCancel={() => setShowDifficultyModal(false)} />}
      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} unlockedAchievements={unlockedAchievements} />}
      {sidebar && <Sidebar players={players} onClose={() => setSidebar(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} user={user} players={players} />}
      <Toast msg={toast} onClear={() => setToast('')} />
    </motion.div>
  );
}