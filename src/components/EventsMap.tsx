import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useUserContext } from '../userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning, faSoccerBall, faUser, faTrash } from '@fortawesome/free-solid-svg-icons'
import '../stylesheets/eventMap.css'
import { useTranslation } from 'react-i18next'
import { CustomMarkerIcon } from './CreateEvent.tsx'

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
    const { t } = useTranslation()
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
                className="absolute top-4 right-4 z-50 w-fit text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background hover:text-light-background hover:bg-light-primary dark:hover:bg-dark-primary p-4 rounded-xl"
            >
                {tileLayerURL === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png' ? (
                    <FontAwesomeIcon icon={['fas', 'satellite']} />
                ) : (
                    <FontAwesomeIcon icon={['fas', 'map']} />
                )}
            </button>
            <MapContainer
                center={[46.1512, 14.9955]}
                zoom={8}
                minZoom={6}
                style={{ height: '70vh', width: '100%' }}
                className="z-40 rounded-xl"
            >
                <TileLayer url={tileLayerURL} attribution={tileLayerATTR} />
                {events.map((event) => (
                    <Marker
                        key={event._id}
                        icon={CustomMarkerIcon}
                        position={[event.location.coordinates[1], event.location.coordinates[0]]}
                    >
                        <Popup>
                            <div
                                key={event._id}
                                className="event-card-M w-full p-2 m-0 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            >
                                <div className="head-M">
                                    <div className="host-info-M">
                                        <img
                                            src={
                                                event.host.image
                                                    ? `${import.meta.env.API_URL}/images/profile_pictures/` +
                                                      event.host.image
                                                    : '/defaultProfilePicture.png'
                                            }
                                            alt={event.host.username}
                                            className="host-image-M h-10 w-10 rounded-full"
                                        />
                                        <p className="host-name-M text-light-text dark:text-dark-text">
                                            {event.host.username}
                                        </p>
                                    </div>
                                    {user && (user.isAdmin || user._id === event.host._id) ? (
                                        <button
                                            onClick={() => deleteEvent(event._id)}
                                            className="delete-event-M rounded-xl"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="event-info-M">
                                    <h3 className="event-title-M text-light-accent dark:text-dark-accent">
                                        {event.name}
                                    </h3>
                                    <p className="event-description-M text-light-text dark:text-dark-text">
                                        {event.description}
                                    </p>
                                    <p className="event-date-M text-light-text dark:text-dark-text">
                                        {t('event_page.event_start_at')} <strong>{formatDateString(event.date)}</strong>
                                        &nbsp;
                                        {t('event_page.at')}&nbsp;
                                        <strong>{event.time}</strong>
                                    </p>
                                </div>
                                <div className="flex justify-evenly items-center">
                                    <p className="followers-display-M text-light-text dark:text-dark-text">
                                        {user && following.includes(event._id) && !event.followers.includes(user._id)
                                            ? event.followers.length + 1
                                            : user &&
                                                !following.includes(event._id) &&
                                                event.followers.includes(user._id)
                                              ? event.followers.length - 1
                                              : event.followers.length}{' '}
                                        <FontAwesomeIcon icon={faUser} />
                                    </p>
                                    <p className="event-activity-M bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-text p-2 w-fit">
                                        {event.activity}{' '}
                                        <FontAwesomeIcon
                                            icon={event.activity === 'nogomet' ? faSoccerBall : faPersonRunning}
                                        />
                                    </p>
                                    <button
                                        onClick={(e) => followEvent(event, e)}
                                        className="follow-button-M w-fit h-8 px-2"
                                    >
                                        {user && (following.includes(event._id) || event.followers.includes(user._id))
                                            ? `${t('event_page.following')} ✓`
                                            : `${t('event_page.follow')} +`}
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MainMap