//import React from 'react';
import { Link } from 'react-router-dom' // useNavigate
import UserBox from './UserBox'
//import { useEffect } from 'react';
import { useUserContext } from '../userContext'
import '../stylesheets/navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Navbar() {
    const { user } = useUserContext() //  setUserC  return (

    return (
        <nav className="relative top-3 p-2 rounded-xl flex flex-row justify-between bg-light-primary dark:bg-dark-primary">
            <div className="mx-4 hover:text-light-accent transition-all duration-500">
                <Link to="/">
                    <FontAwesomeIcon icon={['fas', 'home']} size="2x" />
                </Link>
            </div>
            <div id="right-side" className="bg-light-primary dark:bg-dark-primary">
                <div id="pages-links">
                    <Link
                        to="/schedule"
                        className="hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                    >
                        Schedule
                    </Link>
                    <Link
                        to="/standings"
                        className="hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                    >
                        Standings
                    </Link>
                    <Link
                        to="/graphs"
                        className="hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                    >
                        Graphs
                    </Link>
                </div>
                <div id="user-container">
                    {user ? (
                        <>
                            <Link
                                className="center-self-y hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                                to="/events"
                            >
                                Events
                            </Link>
                            <Link
                                className="center-self-y hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                                to="/createEvent"
                            >
                                Create Event
                            </Link>
                            <div id="user-box">
                                <UserBox />
                            </div>
                        </>
                    ) : (
                        <>
                            <p>
                                <Link to="/login">Sign In</Link>
                            </p>
                            <p>
                                <Link to="/register">Sign Up</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar