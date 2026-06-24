import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => (
  <div className="about page-container">
    <section className="about-hero">
      <span className="hero-badge">Portfolio Demo</span>
      <h1>About Cryptogram</h1>
      <p>
        Cryptogram started as a bootcamp project and has evolved into a live
        crypto market dashboard. It pulls real-time data from CoinGecko to
        showcase prices, trends, and market statistics — no sign-ups, no
        wallets, no trading.
      </p>
    </section>

    <section className="about-grid">
      <div className="about-card glass-card">
        <h2>What it does</h2>
        <ul>
          <li>Live prices for the top 100 cryptocurrencies</li>
          <li>7-day sparkline trends in the market table</li>
          <li>Interactive price charts with multiple timeframes</li>
          <li>Global market stats — cap, volume, BTC dominance</li>
          <li>Multi-currency support (USD, EUR, GBP)</li>
          <li>Watchlist with local storage persistence</li>
          <li>Gainers, losers, and watchlist market tabs</li>
          <li>Side-by-side coin comparison (up to 3 coins)</li>
          <li>Auto-refresh every 60 seconds</li>
          <li>Dark and light theme toggle</li>
        </ul>
      </div>

      <div className="about-card glass-card">
        <h2>Built with</h2>
        <ul>
          <li>React 19 + Vite</li>
          <li>Recharts for data visualization</li>
          <li>CoinGecko API for market data</li>
          <li>Vercel serverless proxy with CoinRanking fallback</li>
          <li>Vitest + Cypress for testing</li>
        </ul>
      </div>

      <div className="about-card glass-card">
        <h2>Disclaimer</h2>
        <p>
          This is a demonstration project for educational and portfolio
          purposes. Nothing on this site constitutes financial advice. Crypto
          markets are volatile — always do your own research.
        </p>
      </div>
    </section>

    <div className="about-cta">
      <Link to="/" className="btn-primary">
        Explore markets →
      </Link>
    </div>
  </div>
);

export default About;
