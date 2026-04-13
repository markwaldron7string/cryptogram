import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext'
import Sparkline from "../../components/Sparkline/Sparkline";
import ChartModal from "../../components/ChartModal/ChartModal";

const Home = () => {

  const {allCoins, currency} = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [modalData, setModalData] = useState(null);

  const inputHandler = (event)=>{
    setInput(event.target.value);
    if(event.target.value === ""){
      setDisplayCoin(allCoins);
    }
  }

  const searchHandler = async (event)=>{
    event.preventDefault();
    const coins = await allCoins.filter((item)=>{
      return item.name.toLowerCase().includes(input.toLowerCase())
    })
    setDisplayCoin(coins);
  }

  const handleRowClick = async (coin) => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`
    );
    const data = await res.json();

    setModalData(data);
    setSelectedCoin(coin);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    setDisplayCoin(allCoins);
  },[allCoins])

  return (
    <div className='home'>
      <div className="hero">
        <h1>The Elite <br/> Crypto Marketplace</h1>
        <p>Welcome to the world's largest cryptocurrency marketplace. Sign up to learn more about crypto, and start trading today.</p>
        <form onSubmit={searchHandler}>

          <input onChange={inputHandler} list='coinlist' value={input} type="text" 
          placeholder='Search crypto...' required/>
          
          <datalist id='coinlist'>
            {allCoins.map((item, index)=>(<option key={index} value={item.name}/>))}
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
          <p style={{ textAlign: "center" }}>7d</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {
          displayCoin.slice(0,100).map((item, index)=>(
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

              <Sparkline data={item.sparkline_in_7d?.price} />

              <p className='market-cap'>
                {currency.symbol} {item.market_cap.toLocaleString()}
              </p>
            </div>
          ))
        }
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
