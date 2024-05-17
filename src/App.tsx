//import { useState } from 'react'
import './App.css'
import { UserProvider } from './userContext'
import { JWTProvider } from './userContext'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
      <UserProvider>
          <JWTProvider>
            <Navbar />
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
