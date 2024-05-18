//import { useState } from 'react'
import './App.css'
import { UserProvider } from './userContext'
import { JWTProvider } from './userContext'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {useState} from "react";
import {FootballTeamList} from "./components/FootballTeamList.tsx";
import {HandballTeamList} from "./components/HandballTeamList.tsx";

function App() {
  const [showFootball, setShowFootball] = useState(true);

  return (
    <>
    <BrowserRouter>
      <UserProvider>
          <JWTProvider>
            <Navbar />
            <button onClick={() => setShowFootball(!showFootball)}>Toggle</button>
            {showFootball ? <FootballTeamList/> : <HandballTeamList/>}
              <Routes>
                <Route path="/" element={<p></p>} />
                <Route path="/register" element={<p></p>} /> 
                <Route path="/login" element={<p></p>} />
                <Route path="/profile" element={<p></p>} />
                <Route path="/settings" element={<p></p>} />
                <Route path="/logout" element={<p></p>} />
              </Routes>
          </JWTProvider>
      </UserProvider>
    </BrowserRouter>
    </>
  )
}

export default App;