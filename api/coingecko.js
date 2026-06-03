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
    },
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

const getFallbackPayload = async (requestedPath, query) => {
  if (requestedPath === "/coins/markets") {
    return fetchCoinRankingMarkets();
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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { path, ...query } = req.query;
  const requestedPath = Array.isArray(path) ? path[0] : path;

  if (!requestedPath || !requestedPath.startsWith("/")) {
    res.status(400).json({ error: "Missing CoinGecko API path." });
    return;
  }

  try {
    const url = new URL(`${COINGECKO_API_URL}${requestedPath}`);

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => url.searchParams.append(key, entry));
        return;
      }

      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });

    const headers = { accept: "application/json" };
    const apiKey = process.env.COINGECKO_API_KEY || process.env.VITE_COINGECKO_KEY;
    if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

    const response = await fetch(url, { headers });
    const body = await response.text();

    if (!response.ok) {
      const fallbackPayload = await getFallbackPayload(requestedPath, query);

      if (fallbackPayload) {
        res.status(200).json(fallbackPayload);
        return;
      }
    }

    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    res.send(body);
  } catch (err) {
    console.error("CoinGecko proxy failed:", err);
    res.status(500).json({ error: "CoinGecko proxy failed." });
  }
}
