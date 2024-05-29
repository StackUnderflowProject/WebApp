import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LatLng } from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { IStadium } from '../interfaces/IStadium.ts'
import { Loading } from './Loading.tsx'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -36]
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapComponentProps {
    sport: string
    season: number
    team: string
}

const fetchStadiums = async (sport: string, season: number) => {
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Stadium/filterBySeason/${season}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
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

    const positions: LatLng[] = stadiums
        .filter((x) => team === '' || x.teamId.name === team)
        .map((stadium: IStadium) => new LatLng(stadium.location.coordinates[0], stadium.location.coordinates[1]))

    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-full w-full relative">
                <button
                    onClick={switchTileLayer}
                    className="absolute top-24 z-50 right-4 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background hover:bg-light-primary hover:text-light-background dark:hover:bg-dark-primary w-fit p-4 rounded-xl"
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
                    className="h-full w-full z-40 rounded-xl transition-all duration-500"
                    zoomAnimation={true}
                    markerZoomAnimation={true}
                >
                    <TileLayer url={tileLayerURL} attribution={tileLayerATTR} />
                    {positions.map((position, index) => (
                        <Marker
                            key={index}
                            position={position}
                            eventHandlers={{
                                click: () => {
                                    mapRef.current?.flyTo(position, 16, {
                                        duration: 2
                                    })
                                }
                            }}
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