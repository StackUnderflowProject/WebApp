// import { QueryClient } from '@tanstack/react-query'
// import { ChangeEvent, useState } from 'react'
import { Sport } from '../types/SportType.ts'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import L, { LatLng } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const queryClient = new QueryClient()

interface MatchesMapProps {
    fromDate: Date
    toDate: Date
    sport: Sport
    team: string
}

const fetchMatches = async (sport: Sport, fromDate: Date, toDate: Date) => {
    if (sport === 'all') {
        const responseFootball = await fetch(
            `${import.meta.env.API_URL}/footballMatch/filterByDateRange/${fromDate.toISOString().split('T')[0]}/${toDate.toISOString().split('T')[0]}`
        )
        const responseHandball = await fetch(
            `${import.meta.env.API_URL}/handballMatch/filterByDateRange/${fromDate.toISOString().split('T')[0]}/${toDate.toISOString().split('T')[0]}`
        )
        if (!responseFootball.ok || !responseHandball.ok) {
            throw new Error('Network response was not ok')
        }
        const footballMatches = await responseFootball.json().then((data) => {
            return data.map((match: IMatch) => {
                match.sport = 'football'
                return match
            })
        })
        const handballMatches = await responseHandball.json().then((data) => {
            return data.map((match: IMatch) => {
                match.sport = 'handball'
                return match
            })
        })
        return footballMatches.concat(handballMatches)
    }
    const response = await fetch(
        `${import.meta.env.API_URL}/${sport}Match/filterByDateRange/${fromDate.toISOString().split('T')[0]}/${toDate.toISOString().split('T')[0]}`
    )
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return await response.json().then((data) => {
        return data.map((match: IMatch) => {
            match.sport = sport
            return match
        })
    })
}

interface ITeam {
    _id: string
    name: string
    logoPath: string
}

interface IStadium {
    _id: string
    name: string
    location: {
        type: string
        coordinates: number[]
    }
    buildYear: number | null
    capacity: number | null
    imageUrl: string | null
    teamId: string
}

interface IMatch {
    _id: string
    date: string
    time: string
    home: ITeam
    away: ITeam
    score: string
    location: string
    stadium: IStadium
    sport?: string
}

export const MatchesMap = ({ sport, fromDate, toDate, team }: MatchesMapProps) => {
    const mapRef = useRef(null)
    const {
        data: matches,
        error,
        isLoading,
        isSuccess
    } = useQuery<IMatch[]>({
        queryKey: [`matches`, sport, fromDate, toDate],
        queryFn: () => fetchMatches(sport, fromDate, toDate)
    })

    const [tileLayerURL, setTileLayerURL] = useState('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    const [tileLayerATTR, setTileLayerATTR] = useState(
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    )

    const switchTileLayer = () => {
        if (tileLayerURL === 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') {
            setTileLayerURL('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg')
            setTileLayerATTR(
                '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            )
        } else {
            setTileLayerURL('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            setTileLayerATTR(
                '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            )
        }
    }

    if (error) return <h2>Error: {error.message}</h2>

    if (isLoading) return <h2>Loading...</h2>

    if (!isSuccess) return <h2>No data</h2>

    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-full w-full relative">
                <button
                    onClick={switchTileLayer}
                    className="absolute top-44 z-50 right-4 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background hover:bg-light-primary hover:text-light-background dark:hover:bg-dark-primary w-fit p-4 rounded-xl"
                >
                    {tileLayerURL === 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' ? (
                        <FontAwesomeIcon icon={['fas', 'satellite']} />
                    ) : (
                        <FontAwesomeIcon icon={['fas', 'map']} />
                    )}
                </button>
                <MapContainer
                    ref={mapRef}
                    center={[46.19200522709865, 14.891171889045815]}
                    zoom={9}
                    minZoom={8}
                    className="h-full w-full z-40"
                    zoomAnimation={true}
                    markerZoomAnimation={true}
                >
                    <TileLayer url={tileLayerURL} attribution={tileLayerATTR} />
                    {matches
                        .filter((x) => team === '' || x.home.name === team || x.away.name === team)
                        .map((match, index) => (
                            <Marker
                                icon={L.icon({
                                    iconUrl:
                                        (match?.sport === 'football' ? '/footballMarker.png' : '/handballMarker.png') ||
                                        '/footballMarker.png',
                                    iconSize: [60, 70],
                                    iconAnchor: [30, 70],
                                    popupAnchor: [1, -10]
                                })}
                                key={index}
                                position={
                                    new LatLng(
                                        match.stadium.location.coordinates[0],
                                        match.stadium.location.coordinates[1]
                                    )
                                }
                                eventHandlers={{
                                    click: () => {
                                        // @ts-ignore
                                        mapRef.current?.flyTo(
                                            new LatLng(
                                                match.stadium.location.coordinates[0] + 0.004,
                                                match.stadium.location.coordinates[1]
                                            ),
                                            16,
                                            {
                                                duration: 2
                                            }
                                        )
                                    }
                                }}
                            >
                                <Popup
                                    className="bg-red-600 rounded-xl p-0 m-0"
                                    autoClose
                                    closeButton
                                    closeOnEscapeKey
                                    i18nIsDynamicList
                                    interactive
                                    keepInView
                                    minWidth={400}
                                >
                                    <div className="flex flex-col justify-center items-center w-full h-full p-4 bg-light-background dark:bg-dark-background rounded-xl text-light-text dark:text-dark-text">
                                        <div
                                            className={`text-xl flex ${match.home.name.includes('RK') || match.home.name.includes('RD') ? 'flex-col' : 'flex-row'} justify-center items-center h-full w-full p-2`}
                                        >
                                            <div className="m-2 flex-col flex items-center justify-center gap-2 w-full min-w-max h-full">
                                                {match.home.name}
                                                <br />
                                                {match.home.logoPath && (
                                                    <img
                                                        src={match.home.logoPath}
                                                        alt={match.home.name + ' logo'}
                                                        className="w-16 h-16 rounded-xl"
                                                    />
                                                )}
                                            </div>
                                            vs
                                            <div className="p-2 m-2 text-center flex-col flex items-center justify-center gap-2 w-full min-w-max h-full">
                                                {match.away.name}
                                                {match.away.logoPath && (
                                                    <img
                                                        src={match.away.logoPath}
                                                        alt={match.away.name + ' logo'}
                                                        className="w-16 h-16 rounded-xl"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xl p-0 m-0">
                                            {match.date.split('T')[0]} {match.time}
                                        </span>
                                        <span className="text-2xl text-light-neutral dark:text-dark-neutral p-0 m-0">
                                            {match.score}
                                        </span>
                                        <div className="mt-4">
                                            <h1 className="mb-2">{match.stadium.name}</h1>
                                            {match.stadium.imageUrl && (
                                                <img
                                                    src={match.stadium.imageUrl}
                                                    alt={match.stadium.name}
                                                    className="h-42 max-h-full w-auto rounded-lg"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>
            </div>
        </QueryClientProvider>
    )
}