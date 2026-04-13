import React, { useContext } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import arrow_icon from "../../assets/arrow_icon.png";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";

const Navbar = ({ setShowToast }) => {
  const { setCurrency } = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "€" });
        break;
      case "gbp":
        setCurrency({ name: "gbp", symbol: "£" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
    }
  };

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={logo} alt="" className="logo" />
      </Link>

      <ul>
        <Link to={"/"}>
          <li className="home-btn">Home</li>
        </Link>

        <li>
          <span
            className="coming-soon"
            onClick={(e) => {
              e.preventDefault();
              setShowToast(true);
            }}
            title="Coming soon"
          >
            Features
          </span>
        </li>

        <li>
          <span
            className="coming-soon"
            onClick={(e) => {
              e.preventDefault();
              setShowToast(true);
            }}
            title="Coming soon"
          >
            Pricing
          </span>
        </li>

        <li>
          <span
            className="coming-soon"
            onClick={(e) => {
              e.preventDefault();
              setShowToast(true);
            }}
            title="Coming soon"
          >
            Blog
          </span>
        </li>
      </ul>

      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>

        <button
          className="coming-soon-btn"
          onClick={(e) => {
            e.preventDefault();
            setShowToast(true);
          }}
        >
          Sign Up <img src={arrow_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
