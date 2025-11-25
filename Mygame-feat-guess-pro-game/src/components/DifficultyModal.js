import { motion } from 'framer-motion';
import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function DifficultyModal({ onSelect, onCancel }) {
  const { t } = useContext(LanguageContext);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{t('selectAiDifficulty')}</h2>
        <div className="flex flex-col gap-4">
          <button onClick={() => onSelect('easy')} className="btn-primary text-xl px-8 py-4">
            {t('easy')}
          </button>
          <button onClick={() => onSelect('medium')} className="btn-secondary text-xl px-8 py-4">
            {t('medium')}
          </button>
          <button onClick={() => onSelect('hard')} className="btn-danger text-xl px-8 py-4">
            {t('hard')}
          </button>
        </div>
        <button onClick={onCancel} className="mt-4 text-gray-400 hover:text-white">
          {t('cancel')}
        </button>
      </motion.div>
    </motion.div>
  );
}
