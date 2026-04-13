import { useEffect, useState, useCallback } from "react";
import { CoinContext } from "./CoinContext";

const CoinContextProvider = (props) => {
  const API_KEY = "CG-wtRDt8UMCUTzDcZZSq9Rdzw7";

  const [allCoins, setAllCoins] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  const fetchAllCoins = useCallback(async () => {
    const options = {
      method: "GET",
      headers: { accept: "application/json", "x-cg-demo-api-key": API_KEY },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
      options
    )
      .then((res) => res.json())
      .then((res) => setAllCoins(res))
      .catch((err) => console.error(err));
  }, [currency]);

  useEffect(() => {
    fetchAllCoins();
  }, [fetchAllCoins]);

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
