import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Coin.css";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";
import StarButton from "../../components/StarButton/StarButton";
import { fetchCoinGecko } from "../../utils/fetchCoinGecko";
import { formatLargeNumber, formatPercent, formatPrice } from "../../utils/formatters";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TIMEFRAMES = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [coinError, setCoinError] = useState("");
  const [timeframe, setTimeframe] = useState(7);
  const [chartLoading, setChartLoading] = useState(true);
  const { currency } = useContext(CoinContext);

  useEffect(() => {
    const fetchCoinMeta = async () => {
      setCoinError("");
      setCoinData(null);

      try {
        const coinRes = await fetchCoinGecko(`/coins/${coinId}`);
        const data = await coinRes.json();

        if (!coinRes.ok) {
          throw new Error(data?.error || "Unable to load coin data.");
        }

        setCoinData(data);
      } catch (err) {
        console.error("Failed to fetch coin details:", err);
        setCoinError("Unable to load this coin right now.");
      }
    };

    fetchCoinMeta();
  }, [coinId]);

  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      setHistoricalData(null);

      try {
        const params = { vs_currency: currency.name, days: String(timeframe) };
        if (timeframe >= 30 && timeframe <= 90) {
          params.interval = "daily";
        }

        const historyRes = await fetchCoinGecko(
          `/coins/${coinId}/market_chart`,
          params
        );
        const data = await historyRes.json();

        if (!historyRes.ok) {
          throw new Error(data?.error || "Unable to load chart data.");
        }

        setHistoricalData(data);
      } catch (err) {
        console.error("Failed to fetch chart:", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChart();
  }, [coinId, currency, timeframe]);

  if (coinError) {
    return (
      <div className="coin-error page-container">
        <p>{coinError}</p>
        <Link to="/" className="btn-secondary">
          ← Back to markets
        </Link>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="coin-loading page-container">
        <Skeleton
          circle
          width={64}
          height={64}
          baseColor="#1a1a2e"
          highlightColor="#2a2a3e"
        />
        <Skeleton
          width={200}
          height={32}
          baseColor="#1a1a2e"
          highlightColor="#2a2a3e"
        />
      </div>
    );
  }

  const md = coinData.market_data;
  const price = md.current_price[currency.name];
  const change24h = md.price_change_percentage_24h;
  const ath = md.ath?.[currency.name];
  const athChange = md.ath_change_percentage?.[currency.name];

  const stats = [
    { label: "Market Rank", value: `#${coinData.market_cap_rank}` },
    {
      label: "Market Cap",
      value: formatPrice(md.market_cap[currency.name], currency.symbol, {
        compact: true,
      }),
    },
    {
      label: "24h Volume",
      value: formatPrice(md.total_volume[currency.name], currency.symbol, {
        compact: true,
      }),
    },
    {
      label: "24h High",
      value: formatPrice(md.high_24h[currency.name], currency.symbol),
    },
    {
      label: "24h Low",
      value: formatPrice(md.low_24h[currency.name], currency.symbol),
    },
    {
      label: "Circulating Supply",
      value: `${formatLargeNumber(md.circulating_supply)} ${coinData.symbol.toUpperCase()}`,
    },
    {
      label: "All-Time High",
      value: formatPrice(ath, currency.symbol),
      sub: athChange ? `${formatPercent(athChange)} from ATH` : null,
    },
  ];

  return (
    <div className="coin page-container">
      <Link to="/" className="back-link">
        ← Markets
      </Link>

      <header className="coin-header">
        <img src={coinData.image.large} alt={`${coinData.name} logo`} />
        <div>
          <div className="coin-title-row">
            <h1>
              {coinData.name}{" "}
              <span className="coin-ticker">{coinData.symbol.toUpperCase()}</span>
            </h1>
            <StarButton coinId={coinId} coinName={coinData.name} />
          </div>
          <div className="coin-price-row">
            <span className="coin-price">
              {formatPrice(price, currency.symbol)}
            </span>
            <span
              className={`change-badge ${change24h >= 0 ? "positive" : "negative"}`}
            >
              {formatPercent(change24h)} (24h)
            </span>
          </div>
        </div>
      </header>

      <section className="coin-chart-section glass-card">
        <div className="timeframe-tabs">
          {TIMEFRAMES.map(({ label, days }) => (
            <button
              key={days}
              className={`timeframe-tab ${timeframe === days ? "active" : ""}`}
              onClick={() => setTimeframe(days)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="coin-chart">
          {chartLoading ? (
            <Skeleton
              height={280}
              baseColor="#1a1a2e"
              highlightColor="#2a2a3e"
            />
          ) : (
            <LineChart
              historicalData={historicalData}
              currencySymbol={currency.symbol}
              days={timeframe}
            />
          )}
        </div>
      </section>

      <section className="coin-stats glass-card">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="stat-row">
            <span className="stat-row-label">{label}</span>
            <span className="stat-row-value">
              {value}
              {sub && <span className="stat-row-sub">{sub}</span>}
            </span>
          </div>
        ))}
      </section>

      {coinData.description?.en && (
        <section className="coin-about glass-card">
          <h2>About {coinData.name}</h2>
          <div
            className="coin-description"
            dangerouslySetInnerHTML={{
              __html:
                coinData.description.en.split(". ").slice(0, 3).join(". ") + ".",
            }}
          />
        </section>
      )}
    </div>
  );
};

export default Coin;
