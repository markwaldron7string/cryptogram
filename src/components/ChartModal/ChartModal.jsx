import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ChartModal.css";
import LineChart from "../LineChart/LineChart";
import { CoinContext } from "../../context/CoinContext";
import { formatPrice } from "../../utils/formatters";

const ChartModal = ({ coin, onClose }) => {
  const { currency } = useContext(CoinContext);

  useEffect(() => {
    if (!coin) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [coin, onClose]);

  if (!coin) return null;

  const prices = coin.historicalData?.prices;
  const currentPrice = prices?.[prices.length - 1]?.[1];
  const startPrice = prices?.[0]?.[1];
  const change =
    startPrice && currentPrice
      ? ((currentPrice - startPrice) / startPrice) * 100
      : null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${coin.name} price chart`}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <img src={coin.image} alt="" className="modal-coin-icon" />
            <div>
              <h2>{coin.name}</h2>
              {currentPrice != null && (
                <p className="modal-price">
                  {formatPrice(currentPrice, currency.symbol)}
                  {change != null && (
                    <span
                      className={change >= 0 ? "positive" : "negative"}
                    >
                      {" "}
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(2)}% (7d)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-chart">
          {coin?.historicalData?.prices ? (
            <LineChart
              historicalData={coin.historicalData}
              currencySymbol={currency.symbol}
              days={7}
            />
          ) : (
            <p className="modal-loading">Loading chart...</p>
          )}
        </div>

        <div className="modal-footer">
          <Link
            to={`/coin/${coin.id}`}
            className="btn-primary"
            onClick={onClose}
          >
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;
