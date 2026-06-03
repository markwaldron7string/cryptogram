const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

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

    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    res.send(body);
  } catch (err) {
    console.error("CoinGecko proxy failed:", err);
    res.status(500).json({ error: "CoinGecko proxy failed." });
  }
}
