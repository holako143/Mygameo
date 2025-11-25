import { useState, useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function GameBox({ socket, user, onCancel }) {
  const { t } = useContext(LanguageContext);
  const [options, setOptions] = useState(['', '', '']);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (options.some(opt => !opt.trim())) {
      setError(t('fillAllOptions'));
      return;
    }
    setError('');
    socket.emit('startGame', { room: 'public', options, correct });
    // The parent component will handle the state change after the 'newGame' event is received
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4 neon">{t('createANewGame')}</h2>
      <p className="mb-4 text-gray-400">{t('enterThreeOptions')}</p>
      <form onSubmit={handleSubmit}>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center mb-2">
            <input
              type="radio"
              name="correct"
              checked={correct === i}
              onChange={() => setCorrect(i)}
              className="mr-2 h-5 w-5 text-purple-500 focus:ring-purple-400"
            />
            <input
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`${t('option')} ${i + 1}`}
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
                {t('cancel')}
            </button>
            <button type="submit" className="btn-primary">{t('startGame')}</button>
        </div>
      </form>
    </div>
  );
}