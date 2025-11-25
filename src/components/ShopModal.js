
import { usePlayer } from '@/context/PlayerContext';
import avatars from '@/lib/avatars';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { LanguageContext } from '@/pages/_app';
import Image from 'next/image';
import useAudio from '@/hooks/useAudio';

export default function ShopModal({ onClose }) {
  const { t } = useContext(LanguageContext);
  const { points, purchasedAvatars, purchaseAvatar } = usePlayer();
  const [toast, setToast] = useState('');
  const playPurchaseSound = useAudio('/sounds/purchase.wav');

  const handlePurchase = (avatar) => {
    if (purchaseAvatar(avatar.id, avatar.price)) {
      playPurchaseSound();
      setToast(`${t('purchased')} ${t(avatar.name)}!`);
      setTimeout(() => setToast(''), 2000);
    } else {
      setToast(t('notEnoughPoints'));
      setTimeout(() => setToast(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card w-full max-w-md max-h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold neon">{t('cosmeticsShop')}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <p className="mb-4 text-yellow-400">{t('yourPoints')}: {points}</p>

        {toast && <p className="text-center text-green-400 mb-2">{toast}</p>}

        <ul className="overflow-y-auto space-y-3 pr-2">
          {avatars.map((avatar) => {
            const isOwned = purchasedAvatars.includes(avatar.id) || avatar.price === 0;
            const canAfford = points >= avatar.price;

            return (
              <li key={avatar.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Image src={avatar.image} alt={avatar.name} width={50} height={50} className="rounded-full" />
                  <div>
                    <p className="font-semibold">{t(avatar.name)}</p>
                    <p className="text-sm text-yellow-500">{avatar.price} {t('points')}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePurchase(avatar)}
                  className={`btn ${isOwned ? 'bg-gray-600' : (canAfford ? 'btn-primary' : 'btn-disabled')}`}
                  disabled={isOwned || !canAfford}
                >
                  {isOwned ? t('owned') : t('buy')}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
