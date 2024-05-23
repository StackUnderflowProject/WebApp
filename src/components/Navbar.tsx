//import React from 'react';
import { Link } from 'react-router-dom';  // useNavigate
import UserBox from './UserBox';
//import { useEffect } from 'react';
import {useUserContext} from '../userContext';
import '../stylesheets/navbar.css';

function Navbar() {
  const { user } = useUserContext(); //  setUserC  return (

  return (    
    <nav>
        <div id="left-side"><Link to="/">Home</Link></div>  
        <div id="right-side">
          <div id="pages-links">
            <Link to="/schedule">Razpored tekem</Link>
            <Link to="/standings">Lestvice</Link>
            <Link to="/">Grafi</Link>
          </div>
          <div id="user-container">
            {user ?
              <UserBox />
            :
            <>
              <p><Link to="/login">Prijava</Link></p>
              <p><Link to="/register">Registracija</Link></p>
            </>
            }
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
