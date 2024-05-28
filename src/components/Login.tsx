//import React from 'react';
import { useUserContext } from '../userContext'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../stylesheets/login.css'
import { useTranslation } from 'react-i18next'

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
        console.log('setting to: ' + usernameText)
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
    }

    return (
        <div className="wrapper">
            <div className="container">
                <h2>{t('sign_in_page.sign_in')}</h2>
                <form id="loginForm" onSubmit={(e) => makeLogin(e)}>
                    <div className="form-group">
                        <label htmlFor="username">{t('sign_in_page.username')}:</label>
                        <input
                            value={usernameText}
                            type="text"
                            id="username"
                            onChange={(e) => setUsernameText(e.target.value)}
                            name="username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('sign_in_page.password')}:</label>
                        <input
                            value={passwordText}
                            type="password"
                            id="password"
                            onChange={(e) => setPasswordText(e.target.value)}
                            name="password"
                            required
                        />
                    </div>
                    {authFailed ? <p id="auth-failed">{t('sign_in_page.sign_in_error')}</p> : <></>}
                    <button type="submit" className="btn">
                        {t('sign_in_page.sign_in')}
                    </button>
                </form>
                <div id="nav-register-wrapper">
                    <div id="nav-register">
                        <p>{t('sign_in_page.dont_have_account')}</p>
                        <Link to="/register">{t('sign_in_page.sign_up')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login