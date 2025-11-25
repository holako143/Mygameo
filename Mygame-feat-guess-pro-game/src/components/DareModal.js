
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function DareModal({ dare, onClose }) {
  const { t } = useContext(LanguageContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-bold neon-red mb-4">{t('youLost')}</h2>
        <p className="text-lg mb-6">{t('yourDare')}:</p>
        <p className="text-2xl font-semibold mb-8">{dare}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="btn-primary"
        >
          {t('done')}
        </motion.button>
      </motion.div>
    </div>
  );
}
