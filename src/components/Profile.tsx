import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useUserContext } from '../userContext'
import '../stylesheets/profile.css'

function Profile() {
    const { userId } = useParams()
    const { user, updateUser, isTokenExpired, resetJWT } = useUserContext()

    const [profilePicture, setProfilePicture] = useState('../../default.png') // Assuming default profile picture filename
    const [username, setUsername] = useState('Username')
    const [email, setEmail] = useState('Mail')

    const [showUploadButton, setShowUploadButton] = useState(false)
    const [profilePictureModifier, setProfilePictureModifier] = useState(false)

    const getUser = async () => {
        console.log('getting user')
        const response = await fetch('http://localhost:3000/users/show/' + userId)
        const data = await response.json()
        if (response.ok) {
            console.log(data)
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
        setShowUploadButton(true)
    }

    useEffect(() => {
        getUser()
    }, [userId])

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
                Authorization: 'Bearer: ' + user?.token
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
                                />
                            </label>
                            {showUploadButton ? <button type="submit">Upload</button> : <></>}
                        </form>
                    ) : (
                        <p></p>
                    )}
                    <div className="user-details">
                        <h2>{username}</h2>
                        <p>{email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile