//import { useState } from 'react'
// import './App.css'
import { UserProvider } from './userContext'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FilterMapComponent from './components/FilterMapComponent.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FootballStandingsGraph } from './components/FootballStandingsGraph.tsx'
import { FootballTeamList } from './components/FootballTeamList.tsx'
import { HandballStandingsGraph } from './components/HandballStandingsGraph.tsx'
import { HandballTeamList } from './components/HandballTeamList.tsx'
import { TeamsStats } from './components/TeamsStats.tsx'

import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Profile from './components/Profile.tsx';
import Schedule from './components/Schedule.tsx';
import Standings from './components/Standings.tsx';
import {FootballTeam} from './components/FootballTeam.tsx';
import {HandballTeam} from './components/HandballTeam.tsx';

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <BrowserRouter>
                <UserProvider>
                        <Navbar />
                        <QueryClientProvider client={queryClient}>
                            <Routes>
                                <Route path="/" element={<>
                                    <FilterMapComponent />
                                    <TeamsStats />
                                    <FootballStandingsGraph />
                                    <HandballStandingsGraph />
                                    <FootballTeamList />
                                    <HandballTeamList />
                                </>} 
                                />
                                <Route path="/register" element={<Register />} /> 
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile/:userId" element={<Profile />} />
                                <Route path="/settings" element={<p></p>} />
                                <Route path="/schedule" element={<Schedule />} />
                                <Route path="/standings" element={<Standings />} />
                                <Route path="/footballTeam/:teamId" element={<FootballTeam />} />
                                <Route path="/handballTeam/:teamId" element={<HandballTeam />} />                            </Routes>
                        </QueryClientProvider>
                </UserProvider>
            </BrowserRouter>
        </>
    )
}

export default App