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
import { JWTProvider } from './userContext.tsx'

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <BrowserRouter>
                <UserProvider>
                    <JWTProvider>
                        <Navbar />
                        <QueryClientProvider client={queryClient}>
                            <FilterMapComponent />
                            <TeamsStats />
                            <FootballStandingsGraph />
                            <HandballStandingsGraph />
                            <FootballTeamList />
                            <HandballTeamList />
                        </QueryClientProvider>
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

export default App