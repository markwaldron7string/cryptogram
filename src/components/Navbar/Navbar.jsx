import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../Logo/Logo";
import { RefreshIcon } from "../Icons/Icons";
import "../Icons/Icons.css";
import { CoinContext } from "../../context/CoinContext";
import { useTheme } from "../../context/ThemeContext";
import { CURRENCIES } from "../../utils/currencies";

const Navbar = () => {
  const { currency, setCurrency, lastUpdated, refreshCoins, isLoadingCoins } =
    useContext(CoinContext);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        <Logo className="logo" />
      </Link>

      <nav className={`navbar-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} onClick={closeMenu}>
          Markets
        </Link>
        <Link to="/compare" className={`nav-link ${isActive("/compare") ? "active" : ""}`} onClick={closeMenu}>
          Compare
        </Link>
        <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`} onClick={closeMenu}>
          About
        </Link>
      </nav>

      <div className="nav-right">
        {lastUpdated && (
          <span className="last-updated" title={lastUpdated.toLocaleString()}>
            <span className="live-dot" aria-hidden="true" />
            <span className="mono">{isLoadingCoins ? "SYNC…" : "LIVE"}</span>
          </span>
        )}

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>

        <select
          value={currency.name}
          onChange={(e) => setCurrency(e.target.value)}
          aria-label="Select currency"
          className="currency-select"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          className="refresh-btn"
          onClick={refreshCoins}
          disabled={isLoadingCoins}
          aria-label="Refresh market data"
          title="Refresh"
        >
          <RefreshIcon spinning={isLoadingCoins} />
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
