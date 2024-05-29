import { useState } from 'react'
import { useUserContext } from '../userContext'
import { Link } from 'react-router-dom' // useNavigate
import '../stylesheets/userbox.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
//import { faAddressCard, faGear } from '@fortawesome/free-regular-svg-icons'; // Import the regular icon

function UserBox() {
    const { user, logout } = useUserContext() // setUserContext
    //const { token, setToken, isTokenExpired } = useJWTContext();
    const [userMenuOpened, setUserMenuOpened] = useState(false)

    const userMenuToggle = () => {
        console.log('show')
        setUserMenuOpened(!userMenuOpened)
    }

    return (
        <div className="px-4">
            <img
                src={
                    user && user.image
                        ? 'http://localhost:3000/images/profile_pictures/' + user.image
                        : '/defaultProfilePicture.png'
                }
                alt="profile-picture"
                id="profile-picture"
                onClick={userMenuToggle}
            />
            {userMenuOpened && (
                <div onClick={() => setUserMenuOpened(false)} id="user-profile-menu">
                    <Link to={'/profile/' + user?._id}>
                        <div className="option">
                            <FontAwesomeIcon icon={faAddressCard} />
                            <p>Profil</p>
                        </div>
                    </Link>
                    <Link to="/settings">
                        <div className="option">
                            <FontAwesomeIcon icon={faGear} />
                            <p>Nastavitve</p>
                        </div>
                    </Link>
                    <div className="option" onClick={logout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <p>Odjava</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserBox