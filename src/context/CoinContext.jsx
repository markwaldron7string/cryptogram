import { useEffect, useState } from "react";
import { CoinContext } from "./CoinContext";

const CoinContextProvider = (props) => {
  const API_KEY = "CG-wtRDt8UMCUTzDcZZSq9Rdzw7";

  const [allCoins, setAllCoins] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&sparkline=true`,
          {
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": API_KEY,
            },
          }
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