import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWebSocket } from '../WebsocketContext.tsx';
import { useUserContext } from '../userContext'

const CustomMarkerIcon = L.icon({
    iconUrl: '../../mapMarker.png', // Replace with the path to your checkmark icon
    iconSize: [32, 32], // Adjust size as needed
    iconAnchor: [16, 40], // Adjust anchor to the center of the icon
    popupAnchor: [0, -16] // Adjust popup anchor if needed
})

interface LocationMarkerProps {
    setLocation: (location: LatLng) => void
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ setLocation }) => {
    useMapEvents({
        click(e) {
            setLocation(e.latlng)
        }
    })

    return null
}

interface MapComponentProps {
    selectedLocation: LatLng | null
    setSelectedLocation: (location: LatLng | null) => void
}

const MapComponent: React.FC<MapComponentProps> = React.memo(({ selectedLocation, setSelectedLocation }) => {
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
        <div className="h-full w-full relative">
            <button
                onClick={switchTileLayer}
                className="absolute top-4 right-4 text-black z-50 w-fit text-xl bg-gray-700 hover:bg-white p-2 rounded-xl"
            >
                <strong>View</strong>
            </button>
            <MapContainer
                center={[46.1512, 14.9955]} // Center of Slovenia
                zoom={8}
                className="h-full w-full rounded-xl z-10"
            >
                <TileLayer url={tileLayerURL} attribution={tileLayerATTR} minZoom={0} maxZoom={20} />
                <LocationMarker setLocation={setSelectedLocation} />
                {selectedLocation && (
                    <Marker position={selectedLocation} icon={CustomMarkerIcon}>
                        <Popup>Marked location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
})

export default function CreateEvent() {
    const { socket } = useWebSocket();
    const navigate = useNavigate();
    const { user, isTokenExpired, resetJWT } = useUserContext();
    const today = new Date().toISOString().split('T')[0];

    const [name, setName] = useState(() => {
        const storedName = localStorage.getItem('eventNameC')
        return storedName ? storedName : ''
    })
    useEffect(() => {
        localStorage.setItem('eventNameC', name)
    }, [name])

    const [description, setDescription] = useState(() => {
        const storedDescription = localStorage.getItem('eventDescriptionC')
        return storedDescription ? storedDescription : ''
    })
    useEffect(() => {
        localStorage.setItem('eventDescriptionC', description)
    }, [description])

    const [activity, setActivity] = useState(() => {
        const storedActivity = localStorage.getItem('eventActivityC')
        return storedActivity ? storedActivity : 'football'
    })
    useEffect(() => {
        localStorage.setItem('eventActivityC', activity)
    }, [activity])

    const [date, setDate] = useState(() => {
        const storedDate = localStorage.getItem('eventDateC')
        return storedDate ? storedDate : today
    })
    useEffect(() => {
        localStorage.setItem('eventDateC', date)
    }, [date])

    const [time, setTime] = useState(() => {
        const storedTime = localStorage.getItem('eventTimeC')
        return storedTime ? storedTime : '12:00'
    })
    useEffect(() => {
        localStorage.setItem('eventTimeC', time)
    }, [time])

    const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(() => {
        const storedLocation = localStorage.getItem('eventLocationC')
        return storedLocation && storedLocation !== '' ? JSON.parse(storedLocation) : null
    })
    useEffect(() => {
        if (selectedLocation === null) {
            localStorage.setItem('eventLocationC', '')
        } else {
            localStorage.setItem('eventLocationC', JSON.stringify(selectedLocation))
        }
    }, [selectedLocation])

    const [error, setError] = useState(() => {
        const storedError = localStorage.getItem('eventErrorC')
        return storedError ? storedError : ''
    })
    useEffect(() => {
        localStorage.setItem('eventErrorC', error)
    }, [error])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const nameO = (document.getElementById('event-name') as HTMLInputElement).value
        const descriptionO = (document.getElementById('event-description') as HTMLInputElement).value
        const activityO = (document.getElementById('event-activity') as HTMLSelectElement).value
        const dateO = (document.getElementById('event-date') as HTMLInputElement).value
        const timeO = (document.getElementById('event-time') as HTMLInputElement).value
        if (nameO === '' || descriptionO === '' || selectedLocation === null) {
            setError('Izploniti je potrebno vsa polja, vključno z zemljevidom!')
            return
        }
        if (isTokenExpired()) {
            resetJWT()
            window.alert('Seja je potekla, potrebna je ponovna prijava.')
            return
        }
        try {
            const response = await fetch('http://localhost:3000/events', {
                method: 'POST',
                body: JSON.stringify({
                    name: nameO,
                    description: descriptionO,
                    activity: activityO,
                    date: dateO,
                    time: timeO,
                    location: {
                        type: 'Point',
                        coordinates: [selectedLocation?.lng, selectedLocation?.lat]
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer: ' + user?.token
                }
            })
            if (response.ok) {
                console.log('Event created successfully');
                localStorage.setItem("eventNameC", "");
                localStorage.setItem("eventDescriptionC", "");
                localStorage.setItem("eventActivityC", "nogomet");
                localStorage.setItem("eventDateC", today);
                localStorage.setItem("eventTimeC", "12:00");
                localStorage.setItem("eventLocationC", "");
                localStorage.setItem("eventErrorC", "");
                if (socket) {
                    socket.emit('create-event', user?.token);
                }
                navigate("/");
            }
        } catch (error) {
            console.error('Error creating event:', error)
        }
    }

    const getCurrentDate = (): string => {
        const today = new Date()
        const year = today.getFullYear()
        const month: number = today.getMonth() + 1
        const day: number = today.getDate()

        let monthS = month.toString()
        let dayS = day.toString()

        if (month < 10) {
            monthS = `0${month}`
        }
        if (day < 10) {
            dayS = `0${day}`
        }

        return `${year}-${monthS}-${dayS}`
    }

    const getCurrentTime = (): string => {
        const today = new Date()
        const hours: number = today.getHours()
        const minutes: number = today.getMinutes()

        let hoursS = hours.toString()
        let minutesS = minutes.toString()

        if (hours < 10) {
            hoursS = `0${hours}`
        }
        if (minutes < 10) {
            minutesS = `0${minutes}`
        }

        return `${hoursS}:${minutesS}`
    }

    return (
        <div className="bg-gray-400 mt-8 rounded-xl w-full flex flex-col justify-start items-start gap-4 p-4 xl:h-[88%] ">
            <form
                onSubmit={(e) => handleSubmit(e)}
                id="event-form"
                className="flex flex-col xl:flex-row gap-4 w-full h-full"
            >
                <div className="flex flex-col gap-4 xl:w-1/3 h-full">
                    <div className="flex flex-col gap-4 text-xl p-4 rounded-xl bg-gray-700 w-full">
                        <label htmlFor="event-name" className="">
                            Event name:
                        </label>
                        <input
                            value={name}
                            type="text"
                            id="event-name"
                            name="event-name"
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-4 rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col gap-4 text-xl p-4 rounded-xl bg-gray-700 w-full h-full">
                        <label htmlFor="event-description">Event description:</label>
                        <textarea
                            value={description}
                            id="event-description"
                            name="event-description"
                            className="p-4 rounded-xl resize-none h-full w-full"
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start xl:w-2/3 h-full gap-4">
                    <div className="flex flex-row flex-shrink flex-grow w-full justify-center items-start gap-4">
                        <div className="bg-gray-700 p-4 rounded-xl w-1/2 flex">
                            <label htmlFor="event-date" className="p-4 text-xl">
                                Date:
                            </label>
                            <input
                                value={date}
                                type="date"
                                id="event-date"
                                name="event-date"
                                onChange={(e) => setDate(e.target.value)}
                                min={getCurrentDate()}
                                className="p-4 rounded-xl text-black w-full"
                            />
                        </div>
                        <div className="bg-gray-700 p-4 rounded-xl w-1/2 flex">
                            <label htmlFor="event-time" className="p-4 text-xl">
                                Time:
                            </label>
                            <input
                                value={time}
                                type="time"
                                id="event-time"
                                name="event-time"
                                onChange={(e) => setTime(e.target.value)}
                                min={getCurrentTime()}
                                className="p-4 rounded-xl text-black w-full"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-xl w-full flex">
                        <label htmlFor="event-activity" className="p-4 text-xl">
                            Activity:
                        </label>
                        <input
                            type="text"
                            value={activity}
                            id="event-activity"
                            name="event-activity"
                            onChange={(e) => setActivity(e.target.value)}
                            className="p-4 rounded-xl text-black w-full"
                        ></input>
                    </div>
                    <div className="w-full xl:h-full h-80">
                        <MapComponent selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
                        {error !== '' && <p id="error-label"></p>}
                    </div>
                </div>
            </form>
            <button type="submit" className="w-full h-fit text-xl mt-4 rounded-xl p-4 bg-gray-700">
                Create New Event
            </button>
        </div>
    )
}