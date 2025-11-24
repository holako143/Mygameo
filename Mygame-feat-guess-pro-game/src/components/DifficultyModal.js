import { motion } from 'framer-motion';

export default function DifficultyModal({ onSelect, onCancel }) {
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
        <h2 className="text-2xl font-bold mb-4">Select AI Difficulty</h2>
        <div className="flex flex-col gap-4">
          <button onClick={() => onSelect('easy')} className="btn-primary text-xl px-8 py-4">
            Easy
          </button>
          <button onClick={() => onSelect('medium')} className="btn-secondary text-xl px-8 py-4">
            Medium
          </button>
          <button onClick={() => onSelect('hard')} className="btn-danger text-xl px-8 py-4">
            Hard
          </button>
        </div>
        <button onClick={onCancel} className="mt-4 text-gray-400 hover:text-white">
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}
