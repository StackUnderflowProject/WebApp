// Import necessary modules
import { Link } from 'react-router-dom'
import UserBox from './UserBox'
import { useUserContext } from '../userContext'
// import '../stylesheets/navbar.css'
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
        <nav className="relative flex flex-row justify-between items-center bg-light-background dark:bg-dark-background w-full py-4 z-50">
            <Link to="/" className="mx-8 hover:text-light-accent transition-all duration-500">
                <FontAwesomeIcon icon={['fas', 'home']} size="2x" />
            </Link>
            <div className="w-full flex flex-row justify-end items-center gap-4">
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
                        <UserBox />
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="center-self-y hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                        >
                            {t('navbar.sign_in')}
                        </Link>
                        <Link
                            to="/register"
                            className="center-self-y hover:text-dark-accent hover:bg-dark-background p-2 rounded-xl transition-all duration-500"
                        >
                            {t('navbar.sign_up')}
                        </Link>
                    </>
                )}
            </div>
            <div>
                {language === 'en' && (
                    <button
                        onClick={() => changeLanguage('sl')}
                        className="py-2 px-4 mr-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl hover:bg-light-accent dark:hover:bg-dark-accent transition-all duration-500"
                    >
                        Sl
                    </button>
                )}
                {language === 'sl' && (
                    <button
                        onClick={() => changeLanguage('en')}
                        className="py-2 px-4 mr-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl hover:bg-light-accent dark:hover:bg-dark-accent transition-all duration-500"
                    >
                        En
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar