import { useContext, useEffect } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function Layout({ children }) {
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const bgMusic = document.getElementById('bg-music');

    const playMusic = () => {
      if (bgMusic && bgMusic.paused) {
        bgMusic.volume = 0.1;
        bgMusic.play().catch(error => console.log("Audio autoplay was prevented by the browser."));
        // Remove the event listener after the first interaction
        document.removeEventListener('click', playMusic);
      }
    };

    document.addEventListener('click', playMusic);

    return () => {
      document.removeEventListener('click', playMusic);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
      <audio id="bg-music" src="/sounds/background.mp3" loop />
    </div>
  );
}