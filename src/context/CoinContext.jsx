import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const API_KEY = import.meta.env.VITE_COINGECKO_KEY;

  const [allCoins, setAllCoins] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const headers = { accept: "application/json" };
        if (API_KEY) headers["x-cg-demo-api-key"] = API_KEY;

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&sparkline=true`,
          { headers }
        );

        const data = await res.json();
        setAllCoins(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllCoins();
  }, [currency]);

  const contextValue = {
    allCoins,
    currency,
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