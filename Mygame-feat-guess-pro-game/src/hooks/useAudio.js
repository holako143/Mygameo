import { useState, useEffect } from 'react';

export default function useAudio(url) {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(new Audio(url));
  }, [url]);

  const play = () => {
    if (audio) {
      audio.play();
    }
  };

  return play;
}