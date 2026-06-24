const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const COINRANKING_API_URL = "https://api.coinranking.com/v2";

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getQueryValue = (query, key) => {
  const value = query[key];
  return Array.isArray(value) ? value[0] : value;
};

const normalizeSparkline = (sparkline) => {
  if (!Array.isArray(sparkline)) return [];

  return sparkline
    .map((price) => toNumber(price, Number.NaN))
    .filter((price) => Number.isFinite(price));
};

const fetchCoinRankingJson = async (path, query = {}) => {
  const url = new URL(`${COINRANKING_API_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, { headers: { accept: "application/json" } });
  const data = await response.json();

  if (!response.ok || data?.status !== "success") {
    throw new Error(`CoinRanking request failed with status ${response.status}`);
  }

  return data.data;
};

export const mapCoinRankingMarketCoin = (coin) => ({
  id: coin.uuid,
  symbol: coin.symbol?.toLowerCase() || "",
  name: coin.name || "",
  image: coin.iconUrl || "",
  current_price: toNumber(coin.price),
  market_cap: toNumber(coin.marketCap),
  market_cap_rank: toNumber(coin.rank, null),
  price_change_percentage_24h: toNumber(coin.change),
  sparkline_in_7d: {
    price: normalizeSparkline(coin.sparkline),
  },
});

export const mapCoinRankingDetailCoin = (coin) => {
  const price = toNumber(coin.price);
  const marketCap = toNumber(coin.marketCap);
  const currencyValues = { usd: price, eur: price, gbp: price };
  const marketCapValues = { usd: marketCap, eur: marketCap, gbp: marketCap };

  return {
    id: coin.uuid,
    symbol: coin.symbol?.toLowerCase() || "",
    name: coin.name || "",
    image: {
      large: coin.iconUrl || "",
    },
    market_cap_rank: toNumber(coin.rank, null),
    market_data: {
      current_price: currencyValues,
      market_cap: marketCapValues,
      high_24h: currencyValues,
      low_24h: currencyValues,
      total_volume: marketCapValues,
      circulating_supply: toNumber(coin.supply?.circulating),
      ath: currencyValues,
      ath_change_percentage: { usd: 0, eur: 0, gbp: 0 },
      price_change_percentage_24h: toNumber(coin.change),
    },
    description: { en: "" },
  };
};

export const mapSparklineToHistoricalData = (sparkline, days = 10) => {
  const prices = normalizeSparkline(sparkline);
  const timeSpan = toNumber(days, 10) * 24 * 60 * 60 * 1000;
  const step = prices.length > 1 ? timeSpan / (prices.length - 1) : 0;
  const end = Date.now();

  return {
    prices: prices.map((price, index) => [
      end - (prices.length - 1 - index) * step,
      price,
    ]),
  };
};

const fetchCoinRankingMarkets = async () => {
  const data = await fetchCoinRankingJson("/coins", { limit: "100" });
  return data.coins.map(mapCoinRankingMarketCoin);
};

const fetchCoinRankingCoin = async (identifier) => {
  try {
    const data = await fetchCoinRankingJson(`/coin/${encodeURIComponent(identifier)}`);
    return data.coin;
  } catch {
    const data = await fetchCoinRankingJson("/coins", {
      search: identifier.replace(/-/g, " "),
      limit: "1",
    });

    if (!data.coins.length) {
      throw new Error(`No CoinRanking coin found for ${identifier}`);
    }

    return data.coins[0];
  }
};

const buildGlobalFromMarkets = (coins) => {
  const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const totalVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  const btc = coins.find((coin) => coin.symbol === "btc");
  const eth = coins.find((coin) => coin.symbol === "eth");

  const btcPct = btc && totalMarketCap ? (btc.market_cap / totalMarketCap) * 100 : 0;
  const ethPct = eth && totalMarketCap ? (eth.market_cap / totalMarketCap) * 100 : 0;

  return {
    data: {
      total_market_cap: { usd: totalMarketCap, eur: totalMarketCap, gbp: totalMarketCap },
      total_volume: { usd: totalVolume, eur: totalVolume, gbp: totalVolume },
      market_cap_percentage: { btc: btcPct, eth: ethPct },
      active_cryptocurrencies: coins.length,
      market_cap_change_percentage_24h_usd: 0,
    },
  };
};

const getFallbackPayload = async (requestedPath, query) => {
  if (requestedPath === "/coins/markets") {
    return fetchCoinRankingMarkets();
  }

  if (requestedPath === "/global") {
    const coins = await fetchCoinRankingMarkets();
    return buildGlobalFromMarkets(coins);
  }

  const chartMatch = requestedPath.match(/^\/coins\/([^/]+)\/market_chart$/);
  if (chartMatch) {
    const coin = await fetchCoinRankingCoin(chartMatch[1]);
    return mapSparklineToHistoricalData(coin.sparkline, getQueryValue(query, "days"));
  }

  const coinMatch = requestedPath.match(/^\/coins\/([^/]+)$/);
  if (coinMatch) {
    const coin = await fetchCoinRankingCoin(coinMatch[1]);
    return mapCoinRankingDetailCoin(coin);
  }

  return null;
};

const getApiKey = (env = process.env) => {
  const key = env.COINGECKO_API_KEY || env.VITE_COINGECKO_KEY || "";
  const trimmed = key.trim();
  // Only use keys that look valid — bad keys cause 401 on CoinGecko
  return trimmed.length >= 20 ? trimmed : "";
};

export const handleCoinGeckoRequest = async (requestedPath, query = {}, env = process.env) => {
  if (!requestedPath || !requestedPath.startsWith("/")) {
    return { status: 400, body: { error: "Missing CoinGecko API path." } };
  }

  try {
    const url = new URL(`${COINGECKO_API_URL}${requestedPath}`);

    Object.entries(query).forEach(([key, value]) => {
      if (key === "path") return;
      if (Array.isArray(value)) {
        value.forEach((entry) => url.searchParams.append(key, entry));
        return;
      }
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });

    const headers = { accept: "application/json" };
    const apiKey = getApiKey(env);
    if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

    let response = await fetch(url, { headers });
    let body = await response.text();

    // Retry without API key if the key was rejected
    if (response.status === 401 && apiKey) {
      delete headers["x-cg-demo-api-key"];
      response = await fetch(url, { headers });
      body = await response.text();
    }

    if (!response.ok) {
      const fallbackPayload = await getFallbackPayload(requestedPath, query);

      if (fallbackPayload) {
        return { status: 200, body: fallbackPayload };
      }

      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        parsed = { error: body };
      }

      return { status: response.status, body: parsed };
    }

    try {
      return { status: response.status, body: JSON.parse(body) };
    } catch {
      return { status: response.status, body, raw: true };
    }
  } catch (err) {
    console.error("CoinGecko proxy failed:", err);

    try {
      const fallbackPayload = await getFallbackPayload(requestedPath, query);
      if (fallbackPayload) {
        return { status: 200, body: fallbackPayload };
      }
    } catch (fallbackErr) {
      console.error("Fallback also failed:", fallbackErr);
    }

    return { status: 500, body: { error: "CoinGecko proxy failed." } };
  }
};
