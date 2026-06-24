import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "cryptogram-watchlist";

// eslint-disable-next-line react-refresh/only-export-components
export const WatchlistContext = createContext();

const readWatchlist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(readWatchlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const isWatchlisted = useCallback(
    (coinId) => watchlist.includes(coinId),
    [watchlist]
  );

  const toggleWatchlist = useCallback((coinId) => {
    setWatchlist((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  }, []);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, isWatchlisted, toggleWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchlist = () => useContext(WatchlistContext);

export default WatchlistProvider;
