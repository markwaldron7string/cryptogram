import { handleCoinGeckoRequest } from "./coingeckoHandler.js";

export {
  mapCoinRankingDetailCoin,
  mapCoinRankingMarketCoin,
  mapSparklineToHistoricalData,
} from "./coingeckoHandler.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { path, ...query } = req.query;
  const requestedPath = Array.isArray(path) ? path[0] : path;
  const result = await handleCoinGeckoRequest(requestedPath, query);

  if (result.raw) {
    res.status(result.status);
    res.setHeader("Content-Type", "application/json");
    res.send(result.body);
    return;
  }

  res.status(result.status).json(result.body);
}
