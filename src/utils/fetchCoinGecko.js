const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

const shouldUseProxy = () => {
  if (typeof window === "undefined") return false;

  return !["localhost", "127.0.0.1", ""].includes(window.location.hostname);
};

const buildQuery = (url, query) => {
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
};

export const fetchCoinGecko = (path, query = {}, apiKey = "") => {
  if (shouldUseProxy()) {
    const url = new URL("/api/coingecko", window.location.origin);
    url.searchParams.set("path", path);
    buildQuery(url, query);

    return fetch(url);
  }

  const url = new URL(`${COINGECKO_API_URL}${path}`);
  buildQuery(url, query);

  const headers = { accept: "application/json" };
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  return fetch(url, { headers });
};
