import '../styles/globals.css';
import Layout from '@/components/Layout';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Guess & Dare - The Ultimate Party Game</title>
        <meta name="description" content="A real-time online guessing game with a twist of daring challenges. Play with friends, earn points, and climb the leaderboard." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}