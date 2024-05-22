//import { useState } from 'react'
import './App.css'
import { UserProvider } from './userContext'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
//import {useState} from "react";
//import {FootballTeamList} from "./components/FootballTeamList.tsx";
//import {HandballTeamList} from "./components/HandballTeamList.tsx";
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Profile from './components/Profile.tsx';
import Schedule from './components/Schedule.tsx';
import Standings from './components/Standings.tsx';
import FootballClub from './components/FootballClub.tsx';

function App() {
  //const [showFootball, setShowFootball] = useState(true);

  return (
    //<button onClick={() => setShowFootball(!showFootball)}>Toggle</button>
    //{showFootball ? <FootballTeamList/> : <HandballTeamList/>}
    <>
    <BrowserRouter>
      <UserProvider>
            <Navbar />
              <Routes>
                <Route path="/" element={<p></p>} />
                <Route path="/register" element={<Register />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/settings" element={<p></p>} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/standings" element={<Standings />} />
                <Route path="/footballClub/:clubId" element={<FootballClub />} />
              </Routes>
      </UserProvider>
    </BrowserRouter>
    </>
  )
}

export default App;