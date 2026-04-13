import React, { useContext, useEffect, useState } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency, API_KEY } = useContext(CoinContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinRes, historyRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": API_KEY,
            },
          }),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
            {
              headers: {
                accept: "application/json",
                "x-cg-demo-api-key": API_KEY,
              },
            }
          ),
        ]);

        const coinData = await coinRes.json();
        const historicalData = await historyRes.json();

        setCoinData(coinData);
        setHistoricalData(historicalData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [coinId, currency, API_KEY]);

  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image.large} alt="" />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
      </div>

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.current_price[
              currency.name
            ].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.market_cap[
              currency.name
            ].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.high_24h[
              currency.name
            ].toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>
            {currency.symbol}{" "}
            {coinData.market_data.low_24h[
              currency.name
            ].toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;