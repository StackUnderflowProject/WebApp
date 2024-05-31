import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LatLng } from 'leaflet'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { IStadium } from '../interfaces/IStadium.ts'
import { Loading } from './Loading.tsx'
import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Sport } from '../types/SportType.ts'

interface MapComponentProps {
    sport: Sport
    season: number
    team: string
}

interface IStadiumPosition {
    sport: string
    position: LatLng
}

const fetchStadiums = async (sport: Sport, season: number) => {
    if (sport === 'all') {
        const responseFootball = await fetch(`${import.meta.env.API_URL}/footballStadium/filterBySeason/${season}`)
        const responseHandball = await fetch(`${import.meta.env.API_URL}/handballStadium/filterBySeason/${season}`)
        if (!responseFootball.ok || !responseHandball.ok) {
            throw new Error('Network response was not ok')
        }
        const footballStadiums = await responseFootball.json().then((stadiums) =>
            stadiums.map((stadium: IStadium) => {
                stadium.sport = 'football'
                return stadium
            })
        )
        const handballStadiums = await responseHandball.json().then((stadiums) =>
            stadiums.map((stadium: IStadium) => {
                stadium.sport = 'handball'
                return stadium
            })
        )
        return footballStadiums.concat(handballStadiums)
    }
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Stadium/filterBySeason/${season}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return await response.json().then((stadiums) =>
        stadiums.map((stadium: IStadium) => {
            stadium.sport = sport
            return stadium
        })
    )
}

const queryClient = new QueryClient()

export const StadiumMap = ({ sport, season, team }: MapComponentProps) => {
    const mapRef = useRef(null)
    const {
        data: stadiums,
        error,
        isLoading,
        isSuccess
    } = useQuery<IStadium[]>({
        queryKey: ['stadiums', sport, season],
        queryFn: () => fetchStadiums(sport, season)
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

    if (isLoading) return <Loading />

    if (!isSuccess) return <h2>No data</h2>

    const stadiumPositions: IStadiumPosition[] = stadiums
        .filter((x) => team === '' || x.teamId.name === team)
        .map((stadium: IStadium) => {
            return {
                sport: stadium.sport || '',
                position: new LatLng(stadium.location.coordinates[0], stadium.location.coordinates[1])
            }
        })

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
                    className="h-full w-full z-40 transition-all duration-500"
                    zoomAnimation={true}
                    markerZoomAnimation={true}
                >
                    <TileLayer url={tileLayerURL} attribution={tileLayerATTR} />
                    {stadiumPositions.map((stadium, index) => (
                        <Marker
                            key={index}
                            position={stadium.position}
                            eventHandlers={{
                                click: () => {
                                    mapRef.current?.flyTo(stadium.position, 16, {
                                        duration: 2
                                    })
                                }
                            }}
                            icon={L.icon({
                                iconUrl: stadium.sport === 'football' ? '/stadiumMarker.png' : '/arenaMarker.png',
                                iconSize: [46, 50],
                                iconAnchor: [12.5, 41],
                                popupAnchor: [0, -36]
                            })}
                        >
                            <Popup>
                                <div className="flex flex-col justify-center items-center w-80">
                                    <h3 className="text-xl mb-2">{stadiums[index].name}</h3>
                                    {stadiums[index].imageUrl && (
                                        <img
                                            src={stadiums[index].imageUrl}
                                            alt={stadiums[index].name}
                                            className="h-36 max-h-full w-auto rounded-lg"
                                        />
                                    )}
                                    {stadiums[index].capacity && (
                                        <h4 className="text-base mt-2">
                                            Capacity: {stadiums[index].capacity}
                                            <br />
                                            Build Year: {stadiums[index].buildYear}
                                        </h4>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </QueryClientProvider>
    )
}