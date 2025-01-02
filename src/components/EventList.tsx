import React, { useState, useEffect } from 'react'
import LoadingScreen from './LoadingScreen'
import '../stylesheets/eventList.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning, faSoccerBall, faUser, faTrash } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { useUserContext } from '../userContext'
import MainMap from './EventsMap'
import { useWebSocket } from '../WebsocketContext.tsx'
import { useTranslation } from 'react-i18next'
import { CustomMarkerIcon } from './CreateEvent.tsx'

export type Event = {
    location: {
        type: string
        coordinates: [number, number]
    }
    _id: string
    name: string
    description: string
    activity: string
    date: string
    time: string
    host: {
        _id: string
        username: string
        email: string
        __v: number
        image: string
    }
    followers: string[]
    image: string
    predicted_count: number
    __v: number
}

interface MapComponentProps {
    title: string
    location: LatLng
}

const MapComponent: React.FC<MapComponentProps> = React.memo(({ title, location }) => {
    const [tileLayerURL, setTileLayerURL] = useState('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png')
    const [tileLayerATTR, setTileLayerATTR] = useState(
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    )

    const switchTileLayer = () => {
        if (tileLayerURL === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png') {
            setTileLayerURL('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg')
            setTileLayerATTR(
                '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            )
        } else {
            setTileLayerURL('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png')
            setTileLayerATTR(
                '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            )
        }
    }

    return (
        <div className="map-container relative">
            <button
                onClick={switchTileLayer}
                className="absolute top-6 right-4 z-50 w-fit  text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background hover:bg-light-primary dark:hover:bg-dark-primary p-4 rounded-xl"
            >
                {tileLayerURL === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png' ? (
                    <FontAwesomeIcon icon={['fas', 'satellite']} />
                ) : (
                    <FontAwesomeIcon icon={['fas', 'map']} />
                )}
            </button>
            <MapContainer
                center={[location.lat, location.lng]} // Center of Slovenia
                zoom={12}
                style={{ height: '400px', width: '100%' }}
                className="rounded-xl z-40"
            >
                <TileLayer url={tileLayerURL} attribution={tileLayerATTR} minZoom={0} maxZoom={20} />
                <Marker position={location} icon={CustomMarkerIcon}>
                    <Popup>{title}</Popup>
                </Marker>
            </MapContainer>
        </div>
    )
})

export default function EventList() {
    const { t } = useTranslation()
    const { socket } = useWebSocket()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const { user, isTokenExpired, resetJWT } = useUserContext()
    const [density, setDensity] = useState('dense')

    const [following, setFollowing] = useState<string[]>(() => {
        const storedFollowing = localStorage.getItem('followingEventTable')
        return storedFollowing ? JSON.parse(storedFollowing) : []
    })
    useEffect(() => {
        localStorage.setItem('followingEventTable', JSON.stringify(following))
    }, [following])

    useEffect(() => {
        if (socket) {
            socket.on('new-event', async () => {
                await getEvents()
            })
            socket.on('delete-event', async () => {
                await getEvents()
            })
            socket.on('error', (obj) => {
                console.error('Error with event socket: ' + obj.message)
            })
            return () => {
                socket.off('new-event')
                socket.off('delete-event')
                socket.off('error')
            }
        }
    }, [socket])

    const getEvents = async () => {
        localStorage.setItem('lastPath', '/events')
        try {
            const response = await fetch(`${import.meta.env.API_URL}/events/upcoming`)
            const data = await response.json()
            if (response.ok) {
                setEvents(data)
            } else {
                console.error('Failed to fetch events')
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getEvents()
    }, [])

    const followEvent = async (event: Event, e: React.MouseEvent<HTMLButtonElement>) => {
        if (isTokenExpired()) {
            resetJWT()
            window.alert(t('event_page.session_expired'))
            return
        }
        const button = e.target as HTMLButtonElement
        if (following.includes(event._id)) {
            button.innerHTML = `${t('event_page.follow')} +`
        } else {
            button.innerHTML = `${t('event_page.following')} ✓`
        }
        try {
            const response = await fetch(`${import.meta.env.API_URL}/events/follow/${event._id}`, {
                headers: {
                    Authorization: 'Bearer: ' + user?.token
                }
            })
            if (response.ok) {
                setFollowing((prevFollowing) => {
                    if (prevFollowing.includes(event._id)) {
                        return prevFollowing.filter((eId) => eId !== event._id)
                    } else {
                        return [...prevFollowing, event._id]
                    }
                })
            } else {
                console.error('Failed to follow event')
            }
        } catch (error) {
            console.error('Error following event:', error)
        }
    }

    const deleteEvent = async (eventId: string) => {
        if (isTokenExpired()) {
            resetJWT()
            window.alert(t('event_page.session_expired'))
            return
        }
        try {
            const response = await fetch(`${import.meta.env.API_URL}/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer: ' + user?.token
                }
            })
            if (response.ok) {
                if (socket) {
                    socket.emit('delete-event')
                }
                getEvents()
            } else {
                console.error(`Failed to delete event: ${response.statusText}`)
            }
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    // CHANGE DATE FORMAT
    const formatDateString = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        let dayOfWeek = new Intl.DateTimeFormat('sl-SI', { weekday: 'long' }).format(date)

        if (date.toDateString() === today.toDateString()) {
            dayOfWeek = 'Danes'
        } else if (date.toDateString() === yesterday.toDateString()) {
            dayOfWeek = 'Včeraj'
        } else if (date.toDateString() === tomorrow.toDateString()) {
            dayOfWeek = 'Jutri'
        }

        const day = new Intl.DateTimeFormat('sl-SI', { day: 'numeric' }).format(date)
        const month = new Intl.DateTimeFormat('sl-SI', { month: 'long' }).format(date)
        return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} - ${day} ${month}`
    }

    const uploadImage = async (eventId: string, file: File) => {
        if (isTokenExpired()) {
            resetJWT()
            window.alert(t('event_page.session_expired'))
            return
        }

        const formData = new FormData()
        formData.append('density', density)
        formData.append('image', file)

        console.log('event name', events.find((event) => event._id === eventId)?.name)

        try {
            // Step 1: Upload the image to the event
            const uploadResponse = await fetch(`${import.meta.env.API_URL}/events/${eventId}/image`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer: ${user?.token}`
                }
            })

            if (!uploadResponse.ok) {
                console.error('Failed to upload image')
                alert(t('event_page.image_upload_failed'))
                return
            }

            const updatedEvent = await uploadResponse.json()

            // Step 2: Predict the count
            const predictResponse = await fetch(`${import.meta.env.PREDICT_URL}/predict`, {
                method: 'POST',
                body: formData
            })

            if (!predictResponse.ok) {
                console.error('Failed to predict count')
                alert(t('event_page.prediction_failed'))
                return
            }

            const prediction = await predictResponse.json()
            const predictedCount = prediction.predicted_count
            console.log('Prediction result:', predictedCount)

            // Step 3: Save the predicted count in the event
            const updateResponse = await fetch(`${import.meta.env.API_URL}/events/${eventId}/predicted-count`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer: ${user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ predicted_count: predictedCount })
            })

            if (!updateResponse.ok) {
                console.error('Failed to update event with predicted count')
                alert(t('event_page.update_predicted_count_failed'))
                return
            }

            const finalUpdatedEvent = await updateResponse.json()
            console.log('Updated event with predicted count:', finalUpdatedEvent)

            // Step 4: Update the frontend state
            console.log(events)

            setEvents((prevEvents) =>
                prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
            )

            console.log(events)
            alert(t('event_page.image_upload_success'))
        } catch (error) {
            console.error('Error uploading image or predicting count:', error)
            alert(t('event_page.upload_error'))
        }
    }

    // LOADING SCREEN
    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="main-container mb-16">
            <div>
                <MainMap
                    events={events}
                    deleteEvent={deleteEvent}
                    followEvent={followEvent}
                    following={following}
                    formatDateString={formatDateString}
                />
            </div>
            <div className="event-list">
                {events.length === 0 ? (
                    <p>{t('event_page.no_events')}</p>
                ) : (
                    events.map((event: Event) => (
                        <div key={event._id} className="event-card dark:bg-dark-background text-dark-text">
                            <div className="event-header">
                                <div className="host-info">
                                    <img
                                        src={
                                            event.host.image
                                                ? `${import.meta.env.API_URL}/public/images/profile_pictures/` +
                                                  event.host.image
                                                : '/defaultProfilePicture.png'
                                        }
                                        alt={event.host.username}
                                        className="host-image"
                                    />
                                    <p className="host-name text-light-text dark:text-dark-text">
                                        {event.host.username}
                                    </p>
                                </div>
                                <div className="header-right-side">
                                    <p className="followers-display">
                                        {user && following.includes(event._id) && !event.followers.includes(user._id)
                                            ? event.followers.length + 1
                                            : user &&
                                                !following.includes(event._id) &&
                                                event.followers.includes(user._id)
                                              ? event.followers.length - 1
                                              : event.followers.length}{' '}
                                        <FontAwesomeIcon icon={faUser} />
                                    </p>
                                    <p className="event-activity dark:bg-dark-primary dark:text-dark-text">
                                        {event.activity}&nbsp;
                                        <FontAwesomeIcon
                                            icon={event.activity === 'nogomet' ? faSoccerBall : faPersonRunning}
                                        />
                                    </p>

                                    <button onClick={(e) => followEvent(event, e)} className="follow-button">
                                        {user && (following.includes(event._id) || event.followers.includes(user._id))
                                            ? `${t('event_page.following')} ✓`
                                            : `${t('event_page.follow')} +`}
                                    </button>
                                    {user && (user.isAdmin || user._id === event.host._id) ? (
                                        <button onClick={() => deleteEvent(event._id)} className="delete-event">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <div className="event-info">
                                <h3 className="event-title dark:text-dark-accent">{event.name}</h3>
                                <p className="event-description">{event.description}</p>
                                {event.predicted_count != 0 && (
                                    <p className="event-predicted-count">
                                        {t('event_page.predicted_count')}:{' '}
                                        {event.predicted_count ?? t('event_page.not_available')}
                                    </p>
                                )}
                                <p className="event-date">
                                    {t('event_page.event_start_at')} <strong>{formatDateString(event.date)}</strong>
                                    &nbsp;
                                    {t('event_page.at')}&nbsp;
                                    <strong>{event.time}</strong>
                                </p>
                            </div>
                            <MapComponent
                                title={event.name}
                                location={new LatLng(event.location.coordinates[1], event.location.coordinates[0])}
                            />
                            {event.image && (
                                <div>
                                    <img
                                        src={`${import.meta.env.API_URL}/${event.image}`}
                                        alt="Event"
                                        className="rounded-xl mt-4 w-full max-w-4xl"
                                    />
                                </div>
                            )}

                            <div className="flex flex-row gap-8 items-center justify-center space-y-4">
                                <select
                                    className="mt-4 p-2 bg-dark-primary text-white rounded-md hover:bg-dark-neutral focus:ring focus:ring-blue-300"
                                    value={density}
                                    onChange={(e) => {
                                        setDensity(e.target.value)
                                    }}
                                >
                                    <option value="dense">{t('event_page.dense')}</option>
                                    <option value="sparse">{t('event_page.sparse')}</option>
                                </select>

                                <input
                                    type="file"
                                    id={`fileUpload-${event._id}`}
                                    className="hidden"
                                    onChange={(e) => {
                                        e.target.files && uploadImage(event._id, e.target.files[0])
                                    }}
                                />

                                {/* Custom File Upload Button */}
                                <label
                                    htmlFor={`fileUpload-${event._id}`}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
                                >
                                    {event.image ? t('event_page.change_image') : t('event_page.upload_image')}
                                </label>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
