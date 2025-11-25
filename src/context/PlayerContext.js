
import { createContext, useContext, useState, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [purchasedAvatars, setPurchasedAvatars] = useState([]);

  useEffect(() => {
    // Load player data from local storage on mount
    try {
      const savedPoints = localStorage.getItem('playerPoints');
      const savedAvatars = localStorage.getItem('purchasedAvatars');

      if (savedPoints) {
        setPoints(JSON.parse(savedPoints));
      }
      if (savedAvatars) {
        setPurchasedAvatars(JSON.parse(savedAvatars));
      }
    } catch (error) {
      console.error("Failed to load player data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // Save player data to local storage whenever it changes
    try {
      localStorage.setItem('playerPoints', JSON.stringify(points));
      localStorage.setItem('purchasedAvatars', JSON.stringify(purchasedAvatars));
    } catch (error) {
      console.error("Failed to save player data to localStorage", error);
    }
  }, [points, purchasedAvatars]);

  const addPoints = (amount) => {
    setPoints(prevPoints => prevPoints + amount);
  };

  const purchaseAvatar = (avatarId, cost) => {
    if (points >= cost && !purchasedAvatars.includes(avatarId)) {
      setPoints(prevPoints => prevPoints - cost);
      setPurchasedAvatars([...purchasedAvatars, avatarId]);
      return true;
    }
    return false;
  };

  const value = {
    points,
    purchasedAvatars,
    addPoints,
    purchaseAvatar,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
