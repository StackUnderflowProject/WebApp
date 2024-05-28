//import { useState } from 'react'
// import './App.css'
import { UserProvider } from './userContext'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WebSocketProvider } from './WebsocketContext.tsx'
import './fontAwesome.js'

import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Profile from './components/Profile.tsx'
import { Schedule } from './components/Schedule.tsx'
import Standings from './components/Standings.tsx'
import { FootballTeam } from './components/FootballTeam.tsx'
import { HandballTeam } from './components/HandballTeam.tsx'
import CreateEvent from './components/CreateEvent.tsx'
import { HomePage } from './components/HomePage.tsx'
import EventList from './components/EventList.tsx'
import { GraphPage } from './components/GraphPage.tsx'
import { Footer } from './components/Footer.tsx'

const queryClient = new QueryClient()

function App() {
    return (
        <div className="h-dvh w-[80%] text-center mx-auto">
            <BrowserRouter>
                <UserProvider>
                    <WebSocketProvider>
                        <Navbar />
                        <QueryClientProvider client={queryClient}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile/:userId" element={<Profile />} />
                                <Route path="/settings" element={<p></p>} />
                                <Route path="/schedule" element={<Schedule />} />
                                <Route path="/standings" element={<Standings />} />
                                <Route path="/footballTeam/:teamId" element={<FootballTeam />} />
                                <Route path="/handballTeam/:teamId" element={<HandballTeam />} />
                                <Route path="/createEvent" element={<CreateEvent />} />
                                <Route path="/events" element={<EventList />} />
                                <Route path="/graphs" element={<GraphPage />} />
                            </Routes>
                        </QueryClientProvider>
                        <Footer />
                    </WebSocketProvider>
                </UserProvider>
            </BrowserRouter>
        </div>
    )
}

export default App