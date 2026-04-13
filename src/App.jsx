import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import Footer from './components/Footer/Footer'
import Toast from './components/Toast/Toast'
import { useState } from 'react'

const App = () => {

  const [showToast, setShowToast] = useState(false);

  return (
    <div className='app'>
      <Navbar setShowToast={setShowToast} />

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/coin/:coinId' element={<Coin/>}/>
      </Routes>

      <Footer/>

      <Toast
        message="Feature coming soon 🚀"
        show={showToast}
        setShow={setShowToast}
      />
    </div>
  )
}

export default App