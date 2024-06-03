import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useUserContext } from '../userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning, faSoccerBall, faUser, faTrash } from '@fortawesome/free-solid-svg-icons'
import '../stylesheets/eventMap.css'

type Event = {
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
    __v: number
}

interface MainMapProps {
    events: Event[]
    following: string[]
    deleteEvent: (eventId: string) => void
    followEvent: (event: Event, e: React.MouseEvent<HTMLButtonElement>) => void
    formatDateString: (dateString: string) => string
}

const MainMap: React.FC<MainMapProps> = ({ events, deleteEvent, followEvent, following, formatDateString }) => {
    const { user } = useUserContext()
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
        <div className="map-M">
            <button
                onClick={switchTileLayer}
                className="absolute top-4 right-4 z-50 w-fit  text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background hover:bg-light-primary dark:hover:bg-dark-primary p-4 rounded-xl"
            >
                {tileLayerURL === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png' ? (
                    <FontAwesomeIcon icon={['fas', 'satellite']} />
                ) : (
                    <FontAwesomeIcon icon={['fas', 'map']} />
                )}
            </button>
            <div className="map-container-M">
                <MapContainer
                    center={[46.1512, 14.9955]}
                    zoom={8}
                    minZoom={6}
                    style={{ height: '70vh', width: '100%' }}
                    className="z-40"
                >
                    <TileLayer url={tileLayerURL} attribution={tileLayerATTR} />
                    {events.map((event) => (
                        <Marker
                            key={event._id}
                            position={[event.location.coordinates[1], event.location.coordinates[0]]}
                        >
                            <Popup>
                                <div key={event._id} className="event-card-M">
                                    <div className="head-M">
                                        <div className="host-info-M">
                                            <img
                                                src={
                                                    event.host.image
                                                        ? 'http://localhost:3000/images/profile_pictures/' +
                                                          event.host.image
                                                        : '/defaultProfilePicture.png'
                                                }
                                                alt={event.host.username}
                                                className="host-image-M"
                                            />
                                            <p className="host-name-M">{event.host.username}</p>
                                        </div>
                                        {user && (user.isAdmin || user._id === event.host._id) ? (
                                            <button onClick={() => deleteEvent(event._id)} className="delete-event-M">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="event-info-M">
                                        <h3 className="event-title-M">{event.name}</h3>
                                        <p className="event-description-M">{event.description}</p>
                                        <p className="event-date-M">
                                            Dogodek se prične <strong>{formatDateString(event.date)}</strong> ob{' '}
                                            <strong>{event.time}</strong>
                                        </p>
                                        <p className="event-activity-M">
                                            {event.activity}{' '}
                                            <FontAwesomeIcon
                                                icon={event.activity === 'nogomet' ? faSoccerBall : faPersonRunning}
                                            />
                                        </p>
                                    </div>
                                    <div className="follow-M">
                                        <p className="followers-display-M">
                                            {user &&
                                            following.includes(event._id) &&
                                            !event.followers.includes(user._id)
                                                ? event.followers.length + 1
                                                : user &&
                                                    !following.includes(event._id) &&
                                                    event.followers.includes(user._id)
                                                  ? event.followers.length - 1
                                                  : event.followers.length}{' '}
                                            <FontAwesomeIcon icon={faUser} />
                                        </p>
                                        <button onClick={(e) => followEvent(event, e)} className="follow-button-M">
                                            {user &&
                                            (following.includes(event._id) || event.followers.includes(user._id))
                                                ? 'Sledim ✓'
                                                : 'Sledi +'}
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}

export default MainMap