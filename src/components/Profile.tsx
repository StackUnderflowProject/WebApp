import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useUserContext } from '../userContext'
import '../stylesheets/profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faClose, faEdit, faLock } from '@fortawesome/free-solid-svg-icons'

function Profile() {
    const { userId } = useParams()
    const { user, updateUser, isTokenExpired, resetJWT } = useUserContext()

    useEffect(() => {
        localStorage.setItem('lastPath', '/profile/' + userId)
    })

    const [profilePicture, setProfilePicture] = useState('../../default.png') // Assuming default profile picture filename
    const [username, setUsername] = useState('Username')
    const [email, setEmail] = useState('Mail')

    const [userEmail, setUserEmail] = useState(() => {
        if (user) {
            return user.email
        }
        return ''
    })

    const [userUsername, setUserUsername] = useState(() => {
        if (user) {
            return user.username
        }
        return ''
    })

    const [showPasswordLabel, setShowPasswordLabel] = useState(false)
    const [editUserInfo, setEditUserInfo] = useState(false)
    const [uploadedPicture, setUploadedPicture] = useState('')
    const [showUploadButton, setShowUploadButton] = useState(false)
    const [profilePictureModifier, setProfilePictureModifier] = useState(false)
    const [error, setError] = useState(() => {
        const storedError = localStorage.getItem('errorUpdateUser')
        return storedError ? storedError : ''
    })
    useEffect(() => {
        localStorage.setItem('errorUpdateUser', error)
    }, [error])

    useEffect(() => {
        setError('')
        setShowPasswordLabel(false)
        if (user) {
            setUserEmail(user.email)
            setUserUsername(user.username)
        }
        if (isTokenExpired() && editUserInfo === true) {
            resetJWT()
            window.alert('Seja je potekla, potrebna je ponovna prijava.')
            return
        }
    }, [editUserInfo])

    const getUser = async () => {
        const response = await fetch('http://localhost:3000/users/show/' + userId)
        const data = await response.json()
        if (response.ok) {
            if (data.image) {
                setProfilePicture('http://localhost:3000/images/profile_pictures/' + data.image)
            } else {
                setProfilePicture('../../default.png')
            }
            setUsername(data.username)
            setEmail(data.email)
        }
    }

    const openFileExplorer = () => {
        const fileInput = document.getElementById('file-upload')
        if (fileInput) {
            fileInput.click()
        }
    }

    useEffect(() => {
        getUser()
        setError('')
    }, [userId])

    const previewImage = async () => {
        const fileUploadElement = document.getElementById('file-upload') as HTMLInputElement
        if (!fileUploadElement || !fileUploadElement.files || fileUploadElement.files.length < 1) {
            setShowUploadButton(false)
            return
        }
        const file = fileUploadElement.files[0]
        const reader = new FileReader()

        reader.onload = function (e) {
            if (e.target) {
                setUploadedPicture(e.target.result as string)
                setShowUploadButton(true)
            }
        }

        reader.readAsDataURL(file)
    }

    const uploadProfilePicture = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData()

        const fileUploadElement = document.getElementById('file-upload') as HTMLInputElement
        if (!fileUploadElement || !fileUploadElement.files || fileUploadElement.files.length < 1) {
            console.log('failed to upload profile picture.')
            return
        }
        const image: File = fileUploadElement?.files[0] ?? null
        form.append('profile_picture', image)

        if (isTokenExpired()) {
            resetJWT()
            window.alert('Seja je potekla, potrebna je ponovna prijava.')
            return
        }

        const response = await fetch('http://localhost:3000/users/profilePicture', {
            method: 'POST',
            body: form,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        })
        if (response.ok) {
            const newUser = await response.json()
            newUser.token = user?.token
            updateUser(newUser)
            setProfilePicture('http://localhost:3000/images/profile_pictures/' + newUser?.image)
            setShowUploadButton(false)
        }
    }

    const updateUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const usernameElement = document.getElementById('username-input') as HTMLInputElement
        const emailElement = document.getElementById('mail-input') as HTMLInputElement
        const passwordElement = document.getElementById('password-input') as HTMLInputElement
        const confirmPasswordElement = document.getElementById('confirm-password-input') as HTMLInputElement

        if (isTokenExpired()) {
            resetJWT()
            window.alert('Seja je potekla, potrebna je ponovna prijava.')
            return
        }

        if (!usernameElement || usernameElement.value === '' || !emailElement) {
            setError('Unexpected error')
            return
        }

        const newUsername = usernameElement.value
        const newEmail = emailElement.value
        let password = ''

        if (!passwordElement && newUsername === user?.username && newEmail === user?.email) {
            setEditUserInfo(false)
            return
        }

        if (passwordElement && confirmPasswordElement && passwordElement.value !== confirmPasswordElement.value) {
            setError('Gesli se ne ujemata')
            return
        }

        if (passwordElement && confirmPasswordElement && passwordElement.value === confirmPasswordElement.value) {
            password = passwordElement.value
        }

        const form: { username: string; email: string; password?: string } = { username: newUsername, email: newEmail }
        if (password !== '') {
            form.password = password
        }

        const response = await fetch('http://localhost:3000/users/update/' + user?._id, {
            method: 'PUT',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer: ' + user?.token
            }
        })
        if (response.ok) {
            const newUser = await response.json()
            newUser.token = user?.token
            updateUser(newUser)
            localStorage.setItem('errorUpdateUser', '')
            setEditUserInfo(false)
            return
        }
    }

    return (
        <div className="center">
            <div className="profile-container">
                <div className="profile-info">
                    <div className="image-container">
                        <img
                            src={profilePicture}
                            onMouseEnter={() => setProfilePictureModifier(true)}
                            alt="Profile"
                            className="profile-picture"
                        />
                        {profilePictureModifier ? (
                            <img
                                id="hover-picture"
                                onClick={openFileExplorer}
                                src="/uploadProfilePicture.png"
                                onMouseLeave={() => setProfilePictureModifier(false)}
                                alt="Profile"
                                className="profile-picture"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    {user && user._id == userId ? (
                        <form id="uploadProfilePicture" onSubmit={(e) => uploadProfilePicture(e)}>
                            <label htmlFor="file-upload" className="custom-file-upload">
                                <input
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                    type="file"
                                    name="profile_picture"
                                    accept="image/*"
                                    onChange={previewImage}
                                />
                            </label>
                            {showUploadButton ? (
                                <div className="preview-wrapper">
                                    <div className="image-preview-container">
                                        <button onClick={() => setShowUploadButton(false)} id="close-preview">
                                            <FontAwesomeIcon icon={faClose} />
                                        </button>
                                        <h1 id="preview-title">Objavi profilno sliko</h1>
                                        <img src={uploadedPicture} id="image-preview" alt="your image" />
                                        <button id="upload-button" type="submit">
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </form>
                    ) : (
                        <></>
                    )}
                    <div className="user-details">
                        {editUserInfo ? (
                            <form className="update-user-form" onSubmit={(e) => updateUserInfo(e)}>
                                <button onClick={() => setEditUserInfo(false)} id="edit-user-info-button">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                                <h1>Vnesi nove podatke</h1>
                                <label htmlFor="username-input">Uporabniško ime:</label>
                                <input
                                    value={userUsername}
                                    onChange={(e) => setUserUsername(e.target.value)}
                                    type="text"
                                    id="username-input"
                                    required
                                />
                                <label htmlFor="mail-input">Email:</label>
                                <input
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    type="email"
                                    id="mail-input"
                                    required
                                />
                                {showPasswordLabel ? (
                                    <>
                                        <label htmlFor="password-input">Novo geslo:</label>
                                        <input type="password" id="password-input" required />
                                        <label htmlFor="confirm-password-input">Ponovi geslo:</label>
                                        <input type="password" id="confirm-password-input" required />
                                    </>
                                ) : (
                                    <></>
                                )}
                                {error !== '' ? <p id="error-message">{error}</p> : <></>}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    {!showPasswordLabel ? (
                                        <button id="password-toggle-button" onClick={() => setShowPasswordLabel(true)}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <p>Spremeni geslo</p>
                                                <FontAwesomeIcon icon={faLock} />
                                            </div>
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                    <button id="submit-user-update-btn" type="submit">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <p>Spremeni</p>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </div>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                {user && user._id == userId ? (
                                    <button onClick={() => setEditUserInfo(true)} id="edit-user-info-button">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                ) : (
                                    <></>
                                )}
                                <h2 id="username-label">{username}</h2>
                                <p id="mail-label">{email}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile