import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function JudgmentBox({ socket, judgments }) {
  const { t, language } = useContext(LanguageContext);
  const handleJudgment = (judgment) => {
    socket.emit('submitJudgment', { room: 'public', judgment });
  };

  return (
    <div className="card text-center border-red-500 border-2">
      <h2 className="text-2xl font-bold mb-4 text-red-400 neon">{t('judgmentTime')}</h2>
      <p className="mb-6 text-gray-400">{t('faceAJudgment')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {judgments.map((j, i) => (
          <button
            key={i}
            onClick={() => handleJudgment(j)}
            className="btn-primary bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 p-4 h-full flex items-center justify-center"
          >
            {language === 'ar' ? j.text_ar : j.text_en}
          </button>
        ))}
      </div>
    </div>
  );
}