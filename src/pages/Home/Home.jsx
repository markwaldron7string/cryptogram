import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import Sparkline from "../../components/Sparkline/Sparkline";
import ChartModal from "../../components/ChartModal/ChartModal";
import MarketStats from "../../components/MarketStats/MarketStats";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";
import StarButton from "../../components/StarButton/StarButton";
import ScrollableTable from "../../components/ScrollableTable/ScrollableTable";
import { ChartIcon, ChevronLeft, ChevronRight } from "../../components/Icons/Icons";
import { useWatchlist } from "../../context/WatchlistContext";
import { fetchCoinGecko } from "../../utils/fetchCoinGecko";
import { formatPercent, formatPrice } from "../../utils/formatters";
import { PAGE_SIZE_OPTIONS } from "../../utils/currencies";

const TABS = [
  { id: "all", label: "All" },
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
  { id: "watchlist", label: "Watchlist" },
];

const Home = () => {
  const { allCoins, coinError, currency, isLoadingCoins } =
    useContext(CoinContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const { watchlist } = useWatchlist();

  const coins = useMemo(
    () => (Array.isArray(allCoins) ? allCoins : []),
    [allCoins]
  );

  const tabbedCoins = useMemo(() => {
    let filtered = coins;

    if (activeTab === "gainers") {
      filtered = [...coins]
        .filter((c) => c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    } else if (activeTab === "losers") {
      filtered = [...coins]
        .filter((c) => c.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    } else if (activeTab === "watchlist") {
      filtered = coins.filter((c) => watchlist.includes(c.id));
    }

    if (!searchTerm.trim()) return filtered;

    const term = searchTerm.toLowerCase().trim();
    return filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.symbol.toLowerCase().includes(term)
    );
  }, [coins, activeTab, searchTerm, watchlist]);

  const totalPages = Math.max(1, Math.ceil(tabbedCoins.length / pageSize));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageStart = safePage * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, tabbedCoins.length);
  const pageCoins = tabbedCoins.slice(pageStart, pageEnd);

  const openChartModal = async (coin, event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const res = await fetchCoinGecko(`/coins/${coin.id}/market_chart`, {
        vs_currency: currency.name,
        days: "7",
      });
      const data = await res.json();

      if (!res.ok || !data?.prices) {
        throw new Error(data?.error || "Unable to load chart data.");
      }

      setModalData(data);
      setSelectedCoin(coin);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  const closeModal = () => {
    setSelectedCoin(null);
    setModalData(null);
  };

  const showSkeleton = isLoadingCoins && coins.length === 0;

  return (
    <div className="home page-container">
      <section className="hero animate-in">
        <span className="hero-badge mono">◈ LIVE FEED · COINGECKO</span>
        <h1>Real-time crypto intelligence</h1>
        <p>
          {coins.length > 0
            ? `Tracking ${coins.length}+ assets across global markets.`
            : "Loading global market data…"}{" "}
          Auto-sync every 60s.
        </p>
        <div className="search-bar">
          <span className="search-icon mono" aria-hidden="true">
            /
          </span>
          <input
            type="search"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            aria-label="Search cryptocurrencies"
            className="mono"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      <MarketStats />

      <section className="crypto-table glass-card animate-in delay-2">
        <div className="table-header">
          <div className="table-header-left">
            <h2>Markets</h2>
            <div className="market-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`market-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(0);
                  }}
                >
                  {tab.label}
                  {tab.id === "watchlist" && watchlist.length > 0 && (
                    <span className="tab-count">{watchlist.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="table-controls">
            <label className="page-size-control">
              <span className="mono">Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                aria-label="Coins per page"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            {!showSkeleton && (
              <span className="coin-count mono">
                {tabbedCoins.length} assets
              </span>
            )}
          </div>
        </div>

        <ScrollableTable>
          <div className="table-layout table-head" role="row">
            <p className="star-col" />
            <p>#</p>
            <p>Name</p>
            <p>Price</p>
            <p>24h</p>
            <p className="sparkline-col">7d Trend</p>
            <p className="market-cap">Market Cap</p>
            <p className="chart-col" />
          </div>

          {showSkeleton ? (
            <TableSkeleton rows={12} />
          ) : coinError ? (
            <div className="market-status">
              <p>{coinError}</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : tabbedCoins.length === 0 ? (
            <div className="market-status">
              {activeTab === "watchlist" ? (
                <>
                  <p>Your watchlist is empty.</p>
                  <p className="market-status-hint">
                    Click ☆ on any asset to track it here.
                  </p>
                </>
              ) : searchTerm ? (
                <p>No assets match &ldquo;{searchTerm}&rdquo;.</p>
              ) : (
                <p>No assets to display.</p>
              )}
            </div>
          ) : (
            pageCoins.map((item, i) => {
              const change = item.price_change_percentage_24h;
              const isPositive = change >= 0;

              return (
                <Link
                  to={`/coin/${item.id}`}
                  className="table-layout table-row row-animate"
                  key={item.id}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="star-col">
                    <StarButton coinId={item.id} coinName={item.name} />
                  </div>
                  <p className="rank mono">{item.market_cap_rank}</p>
                  <div className="coin-cell">
                    <img src={item.image} alt={`${item.name} logo`} />
                    <div className="coin-names">
                      <span className="coin-name">{item.name}</span>
                      <span className="coin-symbol mono">{item.symbol}</span>
                    </div>
                  </div>
                  <p className="price mono">
                    {formatPrice(item.current_price, currency.symbol)}
                  </p>
                  <p>
                    <span
                      className={`change-badge ${isPositive ? "positive" : "negative"}`}
                    >
                      {formatPercent(change)}
                    </span>
                  </p>
                  <div className="sparkline-col">
                    <Sparkline
                      data={item.sparkline_in_7d?.price}
                      id={item.id}
                    />
                  </div>
                  <p className="market-cap mono">
                    {formatPrice(item.market_cap, currency.symbol, {
                      compact: true,
                    })}
                  </p>
                  <button
                    className="chart-btn"
                    onClick={(e) => openChartModal(item, e)}
                    aria-label={`Quick chart for ${item.name}`}
                    title="Quick chart"
                  >
                    <ChartIcon />
                  </button>
                </Link>
              );
            })
          )}
        </ScrollableTable>

        {!showSkeleton && tabbedCoins.length > 0 && (
          <div className="table-pagination">
            <button
              className="page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </button>

            <span className="pagination-info mono">
              {pageStart + 1}–{pageEnd} of {tabbedCoins.length}
              <span className="pagination-pages">
                · page {safePage + 1}/{totalPages}
              </span>
            </span>

            <button
              className="page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </section>

      <ChartModal
        coin={
          selectedCoin && modalData
            ? { ...selectedCoin, historicalData: modalData }
            : null
        }
        onClose={closeModal}
      />
    </div>
  );
};

export default Home;
