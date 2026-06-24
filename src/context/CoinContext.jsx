import { createContext, useEffect, useState } from "react";
import { fetchCoinGecko } from "../utils/fetchCoinGecko";
import { getCurrency } from "../utils/currencies";

const REFRESH_INTERVAL_MS = 60_000;
const COINS_PER_PAGE = 250;
const MAX_PAGES = 3;

// eslint-disable-next-line react-refresh/only-export-components
export const CoinContext = createContext();

const fetchMarketPages = async (currencyCode) => {
  const pageRequests = Array.from({ length: MAX_PAGES }, (_, i) =>
    fetchCoinGecko("/coins/markets", {
      vs_currency: currencyCode,
      sparkline: "true",
      per_page: COINS_PER_PAGE,
      page: i + 1,
      order: "market_cap_desc",
    })
  );

  const responses = await Promise.all(pageRequests);
  const allData = [];

  for (const res of responses) {
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) continue;
    if (data.length === 0) break;
    allData.push(...data);
  }

  const seen = new Set();
  return allData.filter((coin) => {
    if (seen.has(coin.id)) return false;
    seen.add(coin.id);
    return true;
  });
};

const CoinContextProvider = (props) => {
  const [allCoins, setAllCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [coinError, setCoinError] = useState("");
  const [isLoadingCoins, setIsLoadingCoins] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currency, setCurrencyState] = useState(getCurrency("usd"));

  const setCurrency = (codeOrObj) => {
    if (typeof codeOrObj === "string") {
      setCurrencyState(getCurrency(codeOrObj));
    } else {
      setCurrencyState(codeOrObj);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAllCoins = async () => {
      setIsLoadingCoins(true);
      setCoinError("");

      try {
        const data = await fetchMarketPages(currency.code);

        if (cancelled) return;

        if (data.length === 0) {
          throw new Error("No market data returned.");
        }

        setAllCoins(data);
        setLastUpdated(new Date());

        try {
          const globalRes = await fetchCoinGecko("/global");
          const global = await globalRes.json();
          if (!cancelled && globalRes.ok && global?.data) {
            setGlobalData(global.data);
          }
        } catch {
          if (!cancelled) {
            const totalCap = data.reduce((sum, c) => sum + (c.market_cap || 0), 0);
            const btc = data.find((c) => c.symbol === "btc");
            const eth = data.find((c) => c.symbol === "eth");
            setGlobalData({
              total_market_cap: { [currency.code]: totalCap },
              total_volume: {
                [currency.code]: data.reduce((sum, c) => sum + (c.total_volume || 0), 0),
              },
              market_cap_percentage: {
                btc: btc && totalCap ? (btc.market_cap / totalCap) * 100 : 0,
                eth: eth && totalCap ? (eth.market_cap / totalCap) * 100 : 0,
              },
              active_cryptocurrencies: data.length,
              market_cap_change_percentage_24h_usd: 0,
            });
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch coin markets:", err);
        setAllCoins((prev) => {
          if (prev.length === 0) {
            setCoinError("Unable to load crypto market data right now.");
            return [];
          }
          return prev;
        });
      } finally {
        if (!cancelled) {
          setIsLoadingCoins(false);
        }
      }
    };

    fetchAllCoins();

    return () => {
      cancelled = true;
    };
  }, [currency.code, refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    allCoins,
    globalData,
    coinError,
    currency: { name: currency.code, symbol: currency.symbol },
    isLoadingCoins,
    lastUpdated,
    setCurrency,
    refreshCoins: () => setRefreshKey((k) => k + 1),
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
