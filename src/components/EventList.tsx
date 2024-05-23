import React, { useState, useEffect } from "react";
import LoadingScreen from './LoadingScreen';
import '../stylesheets/eventList.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faSoccerBall, faUser } from "@fortawesome/free-solid-svg-icons";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useUserContext } from "../userContext";

type Event = {
    location: {
        type: string,
        coordinates: [
            number,
            number
        ]
    },
    _id: string,
    name: string,
    description: string,
    activity: string,
    date: string,
    time: string,
    host: {
        _id: string,
        username: string,
        email: string,
        __v: number,
        image: string
    },
    followers: string[],
    __v: number
};

interface MapComponentProps {
    title: string;
    location: LatLng;
}

const MapComponent: React.FC<MapComponentProps> = React.memo(({ title, location }) => {
    const [tileLayerURL, setTileLayerURL] = useState('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png');
    const [tileLayerATTR, setTileLayerATTR] = useState('&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

    const switchTileLayer = () => {
        if (tileLayerURL === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png') {
            setTileLayerURL("https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg");
            setTileLayerATTR('&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
        } else {
            setTileLayerURL('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png');
            setTileLayerATTR('&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
        }
    }

    return (
        <div className="map-container">
            <button onClick={switchTileLayer} id="map-mode"><strong>Prikaz</strong></button>
            <MapContainer
                center={[location.lat, location.lng]} // Center of Slovenia
                zoom={12}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    url={tileLayerURL}
                    attribution={tileLayerATTR}
                    minZoom={0}
                    maxZoom={20}
                />
                <Marker position={location}>
                    <Popup>{title}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
});


export default function EventList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isTokenExpired, resetJWT } = useUserContext();
    const [following, setFollowing] = useState<string[]>(() => {
        const storedFollowing = localStorage.getItem("followingEventTable");
        return storedFollowing ? JSON.parse(storedFollowing) : [];
    });
    useEffect(() => {
        localStorage.setItem("followingEventTable", JSON.stringify(following));
    }, [following]);

    const getEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/events/upcoming');
            const data = await response.json();
            if (response.ok) {
              setEvents(data);
            } else {
              console.error('Failed to fetch events');
            }
          } catch (error) {
            console.error('Error fetching events:', error);
          } finally {
              setLoading(false);
          }
    }

    useEffect(() => {
        getEvents();
    }, []);

    const followEvent = async (event: Event, e: React.MouseEvent<HTMLButtonElement>) => {
        if (isTokenExpired()) {
            resetJWT();
            window.alert("Seja je potekla, potrebna je ponovna prijava.")
            return;
        }
        const button = e.target as HTMLButtonElement;
        if (following.includes(event._id)) {
            button.innerHTML = "Sledi +";
        } else {
            button.innerHTML = "Sledim ✓";
        }    
        try {
            const response = await fetch(`http://localhost:3000/events/follow/${event._id}`, {
                headers: {
                    'Authorization': 'Bearer: ' + user?.token
                }
            });
            if (response.ok) {
                setFollowing((prevFollowing) => {
                    if (prevFollowing.includes(event._id)) {
                        return prevFollowing.filter(eId => eId !== event._id);
                    } else {
                        return [...prevFollowing, event._id];
                    }
                });
            } else {
                console.error('Failed to follow event');
            }
        } catch (error) {
            console.error('Error following event:', error);
        }
    };
    // CHANGE DATE FORMAT
    const formatDateString = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dayOfWeek = new Intl.DateTimeFormat('sl-SI', { weekday: 'long' }).format(date);

        if (date.toDateString() === today.toDateString()) {
        dayOfWeek = "Danes";
        } else if (date.toDateString() === yesterday.toDateString()) {
        dayOfWeek = "Včeraj";
        } else if (date.toDateString() === tomorrow.toDateString()) {
        dayOfWeek = "Jutri";
        }

        const day = new Intl.DateTimeFormat('sl-SI', { day: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('sl-SI', { month: 'long' }).format(date);
        return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} - ${day} ${month}`;
    };

    // LOADING SCREEN
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="event-list">
            {events.length === 0 ? 
            (<p>No events to display...</p>) : events.map(event => (
                <div key={event._id} className="event-card">
                    <div className="event-header">
                        <div className="host-info">
                            <img src={(event.host.image) ? ("http://localhost:3000/images/profile_pictures/" + event.host.image) : ("/defaultProfilePicture.png")} alt={event.host.username} className="host-image" />
                            <p className="host-name">{event.host.username}</p>
                        </div>
                        <div className="header-right-side">
                            <p className="followers-display">{(user && following.includes(event._id) && !event.followers.includes(user._id)) ? event.followers.length + 1 : (user && !following.includes(event._id) && event.followers.includes(user._id)) ? event.followers.length - 1 : event.followers.length} <FontAwesomeIcon icon={faUser} /></p>
                            <p className="event-activity">{event.activity} <FontAwesomeIcon icon={event.activity === "nogomet" ? faSoccerBall : faPersonRunning}/></p>
                            <button onClick={e => followEvent(event, e)} className="follow-button">{(user && (following.includes(event._id) || event.followers.includes(user._id))) ? "Sledim ✓" : "Sledi +"}</button>
                        </div>
                    </div>
                    <div className="event-info">
                        <h3 className="event-title">{event.name}</h3>
                        <p className="event-description">{event.description}</p>
                        <p className="event-date">Dogodek se prične <strong>{formatDateString(event.date)}</strong> ob <strong>{event.time}</strong></p>
                    </div>
                    <MapComponent title={event.name} location={new LatLng(event.location.coordinates[1], event.location.coordinates[0])}/>
                </div>
            ))}
        </div>
    );
    
}