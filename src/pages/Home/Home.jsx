import React, { useContext, useMemo, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext'
import Sparkline from "../../components/Sparkline/Sparkline";
import ChartModal from "../../components/ChartModal/ChartModal";

const Home = () => {

  const {allCoins, coinError, currency, isLoadingCoins, API_KEY} = useContext(CoinContext);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [modalData, setModalData] = useState(null);
  const coins = useMemo(() => Array.isArray(allCoins) ? allCoins : [], [allCoins]);
  const displayCoin = useMemo(() => {
    if (!searchTerm) return coins;

    return coins.filter((item)=>{
      return item.name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [coins, searchTerm]);

  const inputHandler = (event)=>{
    const value = event.target.value;

    setInput(value);
    if(value === ""){
      setSearchTerm("");
    }
  }

  const searchHandler = (event)=>{
    event.preventDefault();
    setSearchTerm(input);
  }

  const handleRowClick = async (coin) => {
  try {
    const headers = { accept: "application/json" };
    if (API_KEY) headers["x-cg-demo-api-key"] = API_KEY;

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
      { headers }
    );
    const data = await res.json();

    if (!res.ok || !data?.prices) {
      throw new Error(data?.error || "Unable to load chart data.");
    }

    setModalData(data);
    setSelectedCoin(coin);
  } catch (err) {
    console.error("Failed to fetch chart data:", err);
  }
};

  return (
    <div className='home'>
      <div className="hero">
        <h1>The Elite <br/> Crypto Marketplace</h1>
        <p>Welcome to the world's largest cryptocurrency marketplace. Sign up to learn more about crypto, and start trading today.</p>
        <form onSubmit={searchHandler}>

          <input onChange={inputHandler} list='coinlist' value={input} type="text" 
          placeholder='Search crypto...' required/>
          
          <datalist id='coinlist'>
            {coins.map((item, index)=>(<option key={index} value={item.name}/>))}
          </datalist>
          
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign:"center"}}>24h Change</p>
          <p className="sparkline-col" style={{ textAlign: "center" }}>7d</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {isLoadingCoins ? (
          <div className="market-status">Loading market data...</div>
        ) : coinError ? (
          <div className="market-status">{coinError}</div>
        ) : displayCoin.length === 0 ? (
          <div className="market-status">No coins found.</div>
        ) : (
          displayCoin.slice(0,50).map((item, index)=>(
            <div
              className="table-layout"
              key={index}
              onClick={() => handleRowClick(item)}
              style={{ cursor: "pointer" }}
            >
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt="" />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
              <p className={item.price_change_percentage_24h>0?"green":"red"}>
                {Math.floor(item.price_change_percentage_24h*100)/100}
              </p>

              <div className="sparkline-col">
                <Sparkline data={item.sparkline_in_7d?.price} id={item.id} />
              </div>

              <p className='market-cap'>
                {currency.symbol} {item.market_cap.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
      <ChartModal
        coin={
          selectedCoin && modalData
            ? { ...selectedCoin, historicalData: modalData }
            : null
        }
        onClose={() => setSelectedCoin(null)}
        />
    </div>
  )
}

export default Home
