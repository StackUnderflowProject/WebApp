import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Register() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [usernameText, setUsernameText] = useState(() => {
        const storedUsername = localStorage.getItem('usernameTextR')
        return storedUsername ? storedUsername : ''
    })
    const [emailText, setEmailText] = useState(() => {
        const storedEmail = localStorage.getItem('emailTextR')
        return storedEmail ? storedEmail : ''
    })
    const [passwordText, setPasswordText] = useState(() => {
        const storedPassword = localStorage.getItem('passwordTextR')
        return storedPassword ? storedPassword : ''
    })
    const [error, setError] = useState(() => {
        const storedError = localStorage.getItem('errorR')
        return storedError ? storedError : ''
    })

    useEffect(() => {
        localStorage.setItem('usernameTextR', usernameText)
    }, [usernameText])
    useEffect(() => {
        localStorage.setItem('emailTextR', emailText)
    }, [emailText])
    useEffect(() => {
        localStorage.setItem('passwordTextR', passwordText)
    }, [passwordText])
    useEffect(() => {
        localStorage.setItem('errorR', error)
    }, [error])

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const usernameInput = document.getElementById('username') as HTMLInputElement
        const emailInput = document.getElementById('email') as HTMLInputElement
        const passwordInput = document.getElementById('password') as HTMLInputElement
        const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement
        const username: string = usernameInput?.value ?? ''
        const email: string = emailInput?.value ?? ''
        const password: string = passwordInput?.value ?? ''
        const confirmPassword: string = confirmPasswordInput?.value ?? ''
        if (password !== confirmPassword) {
            setError(t('sign_in_page.passwords_dont_match'))
            return
        }

        const response = await fetch(`${import.meta.env.API_URL}/users/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password, email }),
            headers: {
                'Content-Type': 'application/json' // Specify content type
            }
        })
        if (response.status === 400) {
            setError(t('sign_in_page.user_exists'))
            return
        }
        if (response.ok) {
            localStorage.setItem('usernameTextR', '')
            localStorage.setItem('passwordTextR', '')
            localStorage.setItem('emailTextR', '')
            localStorage.setItem('errorR', '')
            navigate('/login')
        }
    }

    return (
        <div className="mt-16 w-max mx-auto p-4 rounded-xl flex flex-col justify-center items-center gap-4 bg-light-background dark:bg-dark-background">
            <h2 className="mt-4 text-2xl text-light-text dark:text-dark-text">{t('sign_in_page.sign_up')}</h2>
            <form
                id="registrationForm"
                className="w-max p-4 rounded-xl flex flex-col gap-4"
                onSubmit={(e) => register(e)}
            >
                <div className="relative flex flex-col justify-start items-start gap-2 bg-light-primary dark:bg-dark-primary p-2 rounded-xl">
                    <label htmlFor="username" className="mx-2 text-light-background dark:text-dark-text">
                        {t('sign_in_page.username')}:
                    </label>
                    <input
                        value={usernameText}
                        onChange={(e) => setUsernameText(e.target.value)}
                        type="text"
                        id="username"
                        name="username"
                        required
                        className="w-full p-2 pl-12 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                    />
                    <FontAwesomeIcon icon={['fas', 'user']} className="absolute bottom-3 left-4 p-2" />
                </div>
                <div className="relative flex flex-col justify-start items-start gap-2 bg-light-primary dark:bg-dark-primary p-2 rounded-xl">
                    <label htmlFor="email" className="mx-2 text-light-background dark:text-dark-text">
                        {t('sign_in_page.email')}
                    </label>
                    <input
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full p-2 pl-12 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                    />
                    <FontAwesomeIcon icon={['fas', 'at']} className="absolute bottom-3 left-4 p-2" />
                </div>
                <div className="relative flex flex-col justify-start items-start gap-2 bg-light-primary dark:bg-dark-primary p-2 rounded-xl">
                    <label htmlFor="password" className="mx-2 text-light-background dark:text-dark-text">
                        {t('sign_in_page.password')}:
                    </label>
                    <input
                        value={passwordText}
                        onChange={(e) => setPasswordText(e.target.value)}
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="w-full p-2 pl-12 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                    />
                    <FontAwesomeIcon icon={['fas', 'lock']} className="absolute bottom-3 left-4 p-2" />
                </div>
                <div className="relative flex flex-col justify-start items-start gap-2 bg-light-primary dark:bg-dark-primary p-2 rounded-xl">
                    <label htmlFor="confirm-password" className="mx-2 text-light-background dark:text-dark-text">
                        {t('sign_in_page.repeat_password')}:
                    </label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        required
                        className="w-full p-2 pl-12 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                    />
                    <FontAwesomeIcon icon={['fas', 'lock']} className="absolute bottom-3 left-4 p-2" />
                </div>
                {error !== '' ? (
                    <p id="auth-failed" className="text-red-500">
                        {error}
                    </p>
                ) : (
                    <></>
                )}
                <button
                    type="submit"
                    className="bg-light-primary dark:bg-dark-primary w-fit mx-auto p-2 rounded-xl hover:bg-light-accent hover:dark:bg-dark-accent transition-all duration-500"
                >
                    {t('sign_in_page.sign_up')}
                </button>
            </form>
            <div className="flex gap-4">
                <p className="text-sm text-light-neutral dark:text-dark-neutral">
                    {t('sign_in_page.already_have_account')}
                </p>
                <Link to="/login" className="text-sm hover:text-light-accent hover:dark:text-dark-accent">
                    {t('sign_in_page.sign_in')}
                </Link>
            </div>
        </div>
    )
}

export default Register