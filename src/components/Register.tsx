import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
        console.log({ username, password, email })
        if (password !== confirmPassword) {
            setError(t('sign_in_page.passwords_dont_match'))
            return
        }

        const response = await fetch('http://localhost:3000/users/register', {
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
        <div className="wrapper">
            <div className="container">
                <h2>{t('sign_in_page.sign_up')}</h2>
                <form id="registrationForm" onSubmit={(e) => register(e)}>
                    <div className="form-group">
                        <label htmlFor="username">{t('sign_in_page.username')}:</label>
                        <input
                            value={usernameText}
                            onChange={(e) => setUsernameText(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">{t('sign_in_page.email')}:</label>
                        <input
                            value={emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('sign_in_page.password')}:</label>
                        <input
                            value={passwordText}
                            onChange={(e) => setPasswordText(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">{t('sign_in_page.repeat_password')}:</label>
                        <input type="password" id="confirm-password" name="confirm-password" required />
                    </div>
                    {error !== '' ? <p id="auth-failed">{error}</p> : <></>}
                    <button type="submit" className="btn">
                        {t('sign_in_page.sign_up')}
                    </button>
                </form>
                <div id="nav-register-wrapper">
                    <div id="nav-register">
                        <p>{t('sign_in_page.already_have_account')}</p>
                        <Link to="/register">{t('sign_in_page.sign_in')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register