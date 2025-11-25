import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';
import achievements from '@/lib/achievements';
import { motion } from 'framer-motion';

export default function AchievementsModal({ onClose, unlockedAchievements }) {
  const { t, language } = useContext(LanguageContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card w-full max-w-md max-h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold neon">{t('achievements')}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <ul className="overflow-y-auto space-y-3 pr-2">
          {achievements.map((ach) => (
            <li
              key={ach.id}
              className={`p-3 rounded-lg ${
                unlockedAchievements.includes(ach.id)
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              }`}
            >
              <p className="font-semibold">
                {language === 'ar' ? ach.name.ar : ach.name.en}
              </p>
              <p className="text-sm">
                {language === 'ar' ? ach.description.ar : ach.description.en}
              </p>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
