import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Compare.css";
import { CoinContext } from "../../context/CoinContext";
import { fetchCoinGecko } from "../../utils/fetchCoinGecko";
import { formatPercent, formatPrice } from "../../utils/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#a855f7", "#22c55e", "#f59e0b"];
const MAX_COINS = 3;

const Compare = () => {
  const { allCoins, currency, isLoadingCoins } = useContext(CoinContext);
  const [selectedIds, setSelectedIds] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [search, setSearch] = useState("");

  const coins = useMemo(
    () => (Array.isArray(allCoins) ? allCoins : []),
    [allCoins]
  );

  const selectedCoins = useMemo(
    () => selectedIds.map((id) => coins.find((c) => c.id === id)).filter(Boolean),
    [selectedIds, coins]
  );

  const suggestions = useMemo(() => {
    if (!search.trim()) return coins.slice(0, 8);
    const term = search.toLowerCase();
    return coins
      .filter(
        (c) =>
          (c.name.toLowerCase().includes(term) ||
            c.symbol.toLowerCase().includes(term)) &&
          !selectedIds.includes(c.id)
      )
      .slice(0, 8);
  }, [coins, search, selectedIds]);

  const addCoin = (coin) => {
    if (selectedIds.length >= MAX_COINS || selectedIds.includes(coin.id)) return;
    setSelectedIds((prev) => [...prev, coin.id]);
    setSearch("");
  };

  const removeCoin = (id) => {
    setSelectedIds((prev) => prev.filter((cid) => cid !== id));
  };

  useEffect(() => {
    if (selectedCoins.length === 0) return;

    let cancelled = false;

    const fetchCharts = async () => {
      setChartLoading(true);

      try {
        const results = await Promise.all(
          selectedCoins.map(async (coin) => {
            const res = await fetchCoinGecko(`/coins/${coin.id}/market_chart`, {
              vs_currency: currency.name,
              days: "30",
            });
            const data = await res.json();
            return { coin, prices: data?.prices || [] };
          })
        );

        if (cancelled) return;

        // Normalize to percentage change from start (base 100)
        const normalized = results.map(({ coin, prices }) => {
          if (!prices.length) return { coin, points: [] };
          const base = prices[0][1];
          return {
            coin,
            points: prices.map(([ts, price]) => ({
              ts,
              [coin.id]: ((price - base) / base) * 100,
            })),
          };
        });

        // Merge by timestamp index (align by index since timestamps may differ slightly)
        const maxLen = Math.max(...normalized.map((n) => n.points.length));
        const merged = [];

        for (let i = 0; i < maxLen; i++) {
          const point = { index: i };
          normalized.forEach(({ coin, points }) => {
            if (points[i]) {
              point[coin.id] = points[i][coin.id];
              if (!point.date && points[i].ts) {
                point.date = new Date(points[i].ts).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }
            }
          });
          merged.push(point);
        }

        setChartData(merged);
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    };

    fetchCharts();

    return () => {
      cancelled = true;
    };
  }, [selectedCoins, currency]);

  const displayChartData = selectedCoins.length === 0 ? [] : chartData;

  return (
    <div className="compare page-container">
      <Link to="/" className="back-link">
        ← Markets
      </Link>

      <header className="compare-header">
        <h1>Compare Coins</h1>
        <p>
          Select up to {MAX_COINS} cryptocurrencies to compare 30-day performance
          (normalized to % change).
        </p>
      </header>

      <section className="compare-picker glass-card">
        <div className="selected-coins">
          {selectedCoins.map((coin, i) => (
            <div key={coin.id} className="selected-chip" style={{ borderColor: COLORS[i] }}>
              <img src={coin.image} alt="" />
              <span>{coin.symbol.toUpperCase()}</span>
              <button onClick={() => removeCoin(coin.id)} aria-label={`Remove ${coin.name}`}>
                ✕
              </button>
            </div>
          ))}
          {selectedIds.length < MAX_COINS && (
            <div className="add-coin">
              <input
                type="search"
                placeholder="Add a coin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {suggestions.length > 0 && search && (
                <ul className="suggestions">
                  {suggestions.map((coin) => (
                    <li key={coin.id}>
                      <button onClick={() => addCoin(coin)}>
                        <img src={coin.image} alt="" />
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedCoins.length >= 2 && (
        <section className="compare-chart glass-card">
          <h2>30-Day Performance (% change)</h2>
          {chartLoading ? (
            <p className="compare-loading">Loading comparison chart...</p>
          ) : (
            <div className="compare-chart-container">
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={displayChartData}>
                  <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={40}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v >= 0 ? "+" : ""}${v.toFixed(0)}%`}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--text-primary)",
                    }}
                    formatter={(value) => `${value >= 0 ? "+" : ""}${value?.toFixed(2)}%`}
                  />
                  <Legend />
                  {selectedCoins.map((coin, i) => (
                    <Line
                      key={coin.id}
                      type="monotone"
                      dataKey={coin.id}
                      name={coin.symbol.toUpperCase()}
                      stroke={COLORS[i]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      )}

      {selectedCoins.length > 0 && (
        <section className="compare-stats glass-card">
          <h2>Side-by-Side Stats</h2>
          <div className="stats-grid">
            {selectedCoins.map((coin, i) => (
              <div key={coin.id} className="stats-column" style={{ borderTopColor: COLORS[i] }}>
                <div className="stats-column-header">
                  <img src={coin.image} alt="" />
                  <Link to={`/coin/${coin.id}`}>{coin.name}</Link>
                </div>
                <ul>
                  <li>
                    <span>Price</span>
                    <span>{formatPrice(coin.current_price, currency.symbol)}</span>
                  </li>
                  <li>
                    <span>24h Change</span>
                    <span className={coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}>
                      {formatPercent(coin.price_change_percentage_24h)}
                    </span>
                  </li>
                  <li>
                    <span>Market Cap</span>
                    <span>{formatPrice(coin.market_cap, currency.symbol, { compact: true })}</span>
                  </li>
                  <li>
                    <span>Rank</span>
                    <span>#{coin.market_cap_rank}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedCoins.length === 0 && !isLoadingCoins && (
        <p className="compare-empty">
          Search and add coins above to start comparing. Try Bitcoin, Ethereum, and Solana.
        </p>
      )}
    </div>
  );
};

export default Compare;
