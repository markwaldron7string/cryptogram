import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import CoinContextProvider from "./context/CoinContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import WatchlistProvider from "./context/WatchlistContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CoinContextProvider>
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </CoinContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
