import { useState } from 'react';
import { useUserContext } from '../userContext';
import { Link } from 'react-router-dom';  // useNavigate
import '../stylesheets/userbox.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
//import { faAddressCard, faGear } from '@fortawesome/free-regular-svg-icons'; // Import the regular icon


function UserBox() {
    
    const { user } = useUserContext();  // setUserContext
    //const { token, setToken, isTokenExpired } = useJWTContext();
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const userMenuToggle = () => {
        console.log("show")
        setUserMenuOpened(!userMenuOpened);
    }

    return (
        <div id="user-box">
            <img src={(user && user.image) ? ("http:/localhost:3000/images/profile_pictures/" + user.image) : ("/defaultProfilePicture.png")} alt="profile-picture" id="profile-picture" onClick={userMenuToggle}></img>
            {(userMenuOpened) ? 
            (<div>
                <div id="user-profile-menu">
                    <Link to="/profile"><div className='option'><FontAwesomeIcon icon={faAddressCard} /><p>Profil</p></div></Link>
                    <Link to="/settings"><div className='option'><FontAwesomeIcon icon={faGear} />Nastavitve</div></Link>
                    <Link to="/logout"><div className='option'><FontAwesomeIcon icon={faRightFromBracket} />Odjava</div></Link>
                </div>
            </div>)
            :
            (<></>)}
        </div>
    )
}

export default UserBox;