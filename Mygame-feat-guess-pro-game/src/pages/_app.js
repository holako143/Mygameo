import '../styles/globals.css';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { createContext } from 'react';
import useTranslation from '@/hooks/useTranslation';
import { PlayerProvider } from '@/context/PlayerContext';

export const LanguageContext = createContext();

export default function App({ Component, pageProps }) {
  const { language, setLanguage, t } = useTranslation();

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <PlayerProvider>
        <Head>
          <title>{t('guessAndDare')}</title>
          <meta name="description" content="A real-time online guessing game with a twist of daring challenges. Play with friends, earn points, and climb the leaderboard." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PlayerProvider>
    </LanguageContext.Provider>
  );
}
