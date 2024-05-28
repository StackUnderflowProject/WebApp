// Import necessary modules
import { Link } from 'react-router-dom'
import UserBox from './UserBox'
import { useUserContext } from '../userContext'
import '../stylesheets/navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

type Language = 'sl' | 'en'

function Navbar() {
    const { user } = useUserContext() // Access user context
    const { t, i18n } = useTranslation() // Initialize translation
    const [language, setLanguage] = useState<Language>('en') // Set default language to English
    // Function to change language
    const changeLanguage = async (lng: Language) => {
        setLanguage(lng)
        await i18n.changeLanguage(lng)
    }

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
                        {t('navbar.schedule')}
                    </Link>
                    <Link
                        to="/standings"
                        className="hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                    >
                        {t('navbar.standings')}
                    </Link>
                    <Link
                        to="/graphs"
                        className="hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                    >
                        {t('navbar.graphs')}
                    </Link>
                </div>
                <div id="user-container">
                    {user ? (
                        <>
                            <Link
                                className="center-self-y hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                                to="/events"
                            >
                                {t('navbar.events')}
                            </Link>
                            <Link
                                className="center-self-y hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                                to="/createEvent"
                            >
                                {t('navbar.create_event')}
                            </Link>
                            <div id="user-box">
                                <UserBox />
                            </div>
                        </>
                    ) : (
                        <>
                            <p>
                                <Link to="/login">{t('navbar.sign_in')}</Link>
                            </p>
                            <p>
                                <Link to="/register">{t('navbar.sign_up')}</Link>
                            </p>
                        </>
                    )}
                </div>
                {language === 'en' && (
                    <button
                        onClick={() => changeLanguage('sl')}
                        className="p-2 px-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl hover:bg-light-accent dark:hover:bg-dark-accent transition-all duration-500"
                    >
                        Sl
                    </button>
                )}
                {language === 'sl' && (
                    <button
                        onClick={() => changeLanguage('en')}
                        className="p-2 px-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl hover:bg-light-accent dark:hover:bg-dark-accent transition-all duration-500"
                    >
                        En
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar