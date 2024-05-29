//import React from 'react';
import { useUserContext } from '../userContext'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Login() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login } = useUserContext() //  setUserContext

    const [authFailed, setAuthFailed] = useState(false)

    // remember form
    const [usernameText, setUsernameText] = useState(() => {
        const storedUsername = localStorage.getItem('usernameText')
        return storedUsername ? storedUsername : ''
    })
    const [passwordText, setPasswordText] = useState(() => {
        const storedPassword = localStorage.getItem('passwordText')
        return storedPassword ? storedPassword : ''
    })
    useEffect(() => {
        localStorage.setItem('usernameText', usernameText)
    }, [usernameText])
    useEffect(() => {
        localStorage.setItem('passwordText', passwordText)
    }, [passwordText])

    // login API
    const makeLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const usernameInput = document.getElementById('username') as HTMLInputElement
        const passwordInput = document.getElementById('password') as HTMLInputElement
        const username: string = usernameInput?.value ?? ''
        const password: string = passwordInput?.value ?? ''

        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json' // Specify content type
                }
            })
            if (response.ok) {
                const data = await response.json()
                if (data.token !== undefined) {
                    login(data)
                }
                localStorage.setItem('usernameText', '')
                localStorage.setItem('passwordText', '')
                navigate('/')
            } else {
                setAuthFailed(true)
            }
        } catch (err) {
            setAuthFailed(true)
        }
    }

    return (
        <div className="mt-16 w-max mx-auto p-4 rounded-xl flex flex-col justify-center items-center gap-4 bg-light-background dark:bg-dark-background">
            <h2 className="mt-4 text-2xl text-light-text dark:text-dark-text">{t('sign_in_page.sign_in')}</h2>
            <form id="loginForm" className="w-max p-4 rounded-xl flex flex-col gap-4" onSubmit={(e) => makeLogin(e)}>
                <div className="flex justify-evenly items-center gap-2 bg-light-primary dark:bg-dark-primary p-2 rounded-xl">
                    <label htmlFor="username" className="ml-auto w-1/2 text-light-background dark:text-dark-text">
                        {t('sign_in_page.username')}:
                    </label>
                    <input
                        value={usernameText}
                        type="text"
                        id="username"
                        onChange={(e) => setUsernameText(e.target.value)}
                        name="username"
                        required
                        className="w-1/2 p-2 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                    />
                </div>
                <div className="flex justify-evenly items-center gap-2 bg-light-primary dark:bg-dark-primary p-2 rounded-xl">
                    <label htmlFor="password" className="ml-auto w-1/2 text-light-background dark:text-dark-text">
                        {t('sign_in_page.password')}:
                    </label>
                    <input
                        value={passwordText}
                        type="password"
                        id="password"
                        onChange={(e) => setPasswordText(e.target.value)}
                        name="password"
                        required
                        className="w-1/2 p-2 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                    />
                </div>
                {authFailed ? <p id="auth-failed">{t('sign_in_page.sign_in_error')}</p> : <></>}
                <button
                    type="submit"
                    className="bg-light-primary dark:bg-dark-primary w-fit mx-auto p-2 rounded-xl text-light-background dark:text-dark-text"
                >
                    {t('sign_in_page.sign_in')}
                    &nbsp;
                    <FontAwesomeIcon icon={['fas', 'sign-in-alt']} />
                </button>
            </form>
            <div className="flex gap-4">
                <p>{t('sign_in_page.dont_have_account')}</p>
                <Link to="/register">{t('sign_in_page.sign_up')}</Link>
            </div>
        </div>
    )
}

export default Login