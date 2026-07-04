import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './Banner.scss'
import './Stats.scss'
import './Calendar.scss'
import './Home.scss'
import './index.css'
import Banner from './components/Banner'
import Stats from './components/Stats'
import Calendar from './components/Calendar'
import Instructions from './components/Instructions'
import Home from './components/Home'

function App() {
    
  return (
     <BrowserRouter>
      <Banner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
