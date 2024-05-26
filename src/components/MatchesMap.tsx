// import { QueryClient } from '@tanstack/react-query'
// import { ChangeEvent, useState } from 'react'
import { Sport } from '../types/SportType.ts'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import L, { LatLng } from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useState } from 'react'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12.5, 41],
    popupAnchor: [0, 0]
})

L.Marker.prototype.options.icon = DefaultIcon

const queryClient = new QueryClient()

interface MatchesMapProps {
    fromDate: Date
    toDate: Date
    sport: Sport
    team: string
}

const fetchMatches = async (sport: Sport, fromDate: Date, toDate: Date) => {
    const response = await fetch(
        `${import.meta.env.API_URL}/${sport}Match/filterByDateRange/${fromDate.toISOString().split('T')[0]}/${toDate.toISOString().split('T')[0]}`
    )
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
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
}

export const MatchesMap = ({ sport, fromDate, toDate, team }: MatchesMapProps) => {
    const {
        data: matches,
        error,
        isLoading,
        isSuccess
    } = useQuery<IMatch[]>({
        queryKey: [`${sport}Match`, sport, fromDate, toDate],
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
            <div className="h-full w-full border-8 rounded-xl border-white relative">
                <button
                    onClick={switchTileLayer}
                    className="absolute top-2 z-50 right-2 text-black w-fit p-2 bg-white rounded-xl hover:bg-gray-200"
                >
                    <strong>View</strong>
                </button>
                <MapContainer center={[46.19200522709865, 14.891171889045815]} zoom={8} className="h-full w-full z-40">
                    <TileLayer url={tileLayerURL} attribution={tileLayerATTR} />
                    {matches
                        .filter((x) => team === '' || x.home.name === team || x.away.name === team)
                        .map((match, index) => (
                            <Marker
                                key={index}
                                position={
                                    new LatLng(
                                        match.stadium.location.coordinates[0],
                                        match.stadium.location.coordinates[1]
                                    )
                                }
                            >
                                <Popup>
                                    <div className="flex flex-col justify-center items-center w-80">
                                        <span className="text-xl flex flex-row justify-center items-center">
                                            <div className=" p-2 m-2 border-2 rounded-xl flex-col flex items-center justify-center gap-2">
                                                {match.home.name}
                                                <br />
                                                {match.home.logoPath && (
                                                    <img
                                                        src={match.home.logoPath}
                                                        alt={match.home.name + ' logo'}
                                                        className="w-16 h-16"
                                                    />
                                                )}
                                            </div>
                                            vs
                                            <div className=" p-2 m-2 text-center border-2 rounded-xl flex-col flex items-center justify-center gap-2">
                                                {match.away.name}
                                                {match.away.logoPath && (
                                                    <img
                                                        src={match.away.logoPath}
                                                        alt={match.away.name + ' logo'}
                                                        className="w-16 h-16"
                                                    />
                                                )}
                                            </div>
                                        </span>
                                        <span className="text-xl p-0 m-0">
                                            {match.date.split('T')[0]} {match.time}
                                        </span>
                                        <span className="text-2xl text-black p-0 m-0">{match.score}</span>
                                        <div className="text-black">
                                            <h1>{match.stadium.name}</h1>
                                            {match.stadium.imageUrl && (
                                                <img
                                                    src={match.stadium.imageUrl}
                                                    alt={match.stadium.name}
                                                    className="h-36 max-h-full w-auto rounded-lg"
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