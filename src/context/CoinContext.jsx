import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const API_KEY = import.meta.env.VITE_COINGECKO_KEY;

  const [allCoins, setAllCoins] = useState([]);
  const [coinError, setCoinError] = useState("");
  const [isLoadingCoins, setIsLoadingCoins] = useState(true);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  useEffect(() => {
    const fetchAllCoins = async () => {
      setIsLoadingCoins(true);
      setCoinError("");

      try {
        const headers = { accept: "application/json" };
        if (API_KEY) headers["x-cg-demo-api-key"] = API_KEY;

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&sparkline=true`,
          { headers }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || `CoinGecko request failed with status ${res.status}`);
        }

        if (!Array.isArray(data)) {
          throw new Error("CoinGecko returned an unexpected response.");
        }

        setAllCoins(data);
      } catch (err) {
        console.error("Failed to fetch coin markets:", err);
        setAllCoins([]);
        setCoinError("Unable to load crypto market data right now.");
      } finally {
        setIsLoadingCoins(false);
      }
    };

    fetchAllCoins();
  }, [currency, API_KEY]);

  const contextValue = {
    allCoins,
    coinError,
    currency,
    isLoadingCoins,
    setCurrency,
    API_KEY,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
