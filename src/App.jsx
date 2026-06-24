import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import About from "./pages/About/About";
import Compare from "./pages/Compare/Compare";
import NotFound from "./pages/NotFound/NotFound";
import Footer from "./components/Footer/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <div className="app">
    <ScrollToTop />
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coin/:coinId" element={<Coin />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

    <Footer />
  </div>
);

export default App;
