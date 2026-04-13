import React from "react";
import "./ChartModal.css";
import LineChart from "../LineChart/LineChart";

const ChartModal = ({ coin, onClose }) => {
  if (!coin) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{coin.name} Chart</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-chart">
          {coin?.historicalData?.prices ? (
            <LineChart historicalData={coin.historicalData} />
            ) : (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
                Loading chart...
            </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChartModal;