import Image from 'next/image';
import { useContext } from 'react';
import { LanguageContext } from '@/pages/_app';
import { usePlayer } from '@/context/PlayerContext';

// The Header component is now simplified for guest mode.
// It no longer needs session-specific functions like signOut.
export default function Header({ user, onMenu, onShop, onAchievements }) {
  const { language, setLanguage, t } = useContext(LanguageContext);
  const { points } = usePlayer();

  const handleLanguageChange = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        {/* The menu button is kept for mobile navigation if needed */}
        <button onClick={onMenu} className="btn-primary lg:hidden">Menu</button>
        <h1 className="text-xl font-bold neon hidden sm:block">{t('guessAndDare')}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleLanguageChange} className="btn-secondary">
          {language === 'en' ? 'العربية' : 'English'}
        </button>
        <button onClick={onAchievements} className="btn-primary">{t('achievements')}</button>
        <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
          <span className="text-yellow-400">{points} {t('points')}</span>
        </div>
        <button onClick={onShop} className="btn-primary">{t('shop')}</button>
        <div className="flex items-center gap-2">
            {/* Display the guest user's randomly generated image */}
            <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full"/>
            <span className="hidden md:inline">{user.name}</span>
        </div>
        {/* The Sign Out button is removed as there is no session to sign out from. */}
      </div>
    </header>
  );
}
