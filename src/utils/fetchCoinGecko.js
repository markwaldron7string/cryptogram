const COINGECKO_PROXY = "/api/coingecko";

const buildQuery = (url, query) => {
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
};

export const fetchCoinGecko = (path, query = {}) => {
  const url = new URL(COINGECKO_PROXY, window.location.origin);
  url.searchParams.set("path", path);
  buildQuery(url, query);
  return fetch(url);
};

export const fetchCoinGeckoJson = async (path, query = {}) => {
  const res = await fetchCoinGecko(path, query);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.status?.error_message || `Request failed (${res.status})`);
  }

  return data;
};
