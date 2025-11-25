import Image from 'next/image';
import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function ScoreBar({ players, currentUserSocketId }) {
  const { t } = useContext(LanguageContext);
  return (
    <div className="card">
      <div className="flex justify-around items-center text-center">
        {players.map((p) => (
          <div key={p.id} className={`p-2 rounded-lg ${p.id === currentUserSocketId ? 'bg-purple-600 shadow-lg' : ''}`}>
            <Image src={p.image} alt={p.name} width={48} height={48} className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-500"/>
            <p className="font-semibold truncate">{p.name}</p>
            <p className="text-sm text-yellow-400">{p.points || 0} {t('points')}</p>
          </div>
        ))}
        {players.length === 0 && <p>{t('waitingForPlayers')}</p>}
      </div>
    </div>
  );
}