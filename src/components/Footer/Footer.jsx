import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner page-container">
      <div className="footer-top">
        <p className="footer-tagline">
          Cryptogram — a live crypto market demo. Not financial advice.
        </p>
        <nav className="footer-links">
          <Link to="/">Markets</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/about">About</Link>
          <a
            href="https://www.coingecko.com/en/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data by CoinGecko
          </a>
        </nav>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} Cryptogram. Built as a portfolio project.
      </p>
    </div>
  </footer>
);

export default Footer;
