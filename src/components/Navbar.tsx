//import React from 'react';
import { Link } from 'react-router-dom' // useNavigate
import UserBox from './UserBox'
//import { useEffect } from 'react';
import { useUserContext } from '../userContext'
import '../stylesheets/navbar.css'

function Navbar() {
    const { user } = useUserContext() //  setUserC  return (

    return (
        <nav className="relative top-3 p-2 border-2 rounded-xl flex flex-row justify-between">
            <div>
                <Link to="/">Domov</Link>
            </div>
            <div id="right-side">
                <div id="pages-links">
                    <Link to="/schedule">Razpored tekem</Link>
                    <Link to="/standings">Lestvice</Link>
                    <Link to="/">Grafi</Link>
                </div>
                <div id="user-container">
                    {user ? (
                        <>
                            <Link className="center-self-y" to="/events">
                                Dogodki
                            </Link>
                            <Link className="center-self-y" to="/createEvent">
                                Ustvari dogodek
                            </Link>
                            <div id="user-box">
                                <UserBox />
                            </div>
                        </>
                    ) : (
                        <>
                            <p>
                                <Link to="/login">Prijava</Link>
                            </p>
                            <p>
                                <Link to="/register">Registracija</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar