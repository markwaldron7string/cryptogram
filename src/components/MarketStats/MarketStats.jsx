import React, { useContext } from "react";
import "./MarketStats.css";
import { CoinContext } from "../../context/CoinContext";
import { formatLargeNumber, formatPrice } from "../../utils/formatters";

const MarketStats = () => {
  const { globalData, currency, isLoadingCoins } = useContext(CoinContext);

  if (isLoadingCoins && !globalData) {
    return (
      <div className="market-stats glass-card">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-item skeleton-stat" />
        ))}
      </div>
    );
  }

  if (!globalData) return null;

  const marketCap = globalData.total_market_cap?.[currency.name];
  const volume = globalData.total_volume?.[currency.name];
  const btcDominance = globalData.market_cap_percentage?.btc;
  const ethDominance = globalData.market_cap_percentage?.eth;
  const activeCoins = globalData.active_cryptocurrencies;
  const marketChange = globalData.market_cap_change_percentage_24h_usd;

  return (
    <div className="market-stats glass-card animate-in delay-1">
      <div className="stat-item">
        <span className="stat-label mono">Market Cap</span>
        <span className="stat-value mono">
          {formatPrice(marketCap, currency.symbol, { compact: true })}
        </span>
        {marketChange != null && (
          <span className={`stat-change mono ${marketChange >= 0 ? "positive" : "negative"}`}>
            {marketChange >= 0 ? "+" : ""}
            {marketChange.toFixed(2)}%
          </span>
        )}
      </div>
      <div className="stat-item">
        <span className="stat-label mono">24h Volume</span>
        <span className="stat-value mono">
          {formatPrice(volume, currency.symbol, { compact: true })}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label mono">BTC Dominance</span>
        <span className="stat-value mono">{btcDominance?.toFixed(1)}%</span>
        <span className="stat-sub mono">ETH {ethDominance?.toFixed(1)}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label mono">Active Coins</span>
        <span className="stat-value mono">{formatLargeNumber(activeCoins)}</span>
      </div>
    </div>
  );
};

export default MarketStats;
