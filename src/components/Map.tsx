import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LatLng } from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { useQuery } from '@tanstack/react-query'
import { IStadium } from '../interfaces/IStadium.ts'
import { Loading } from './Loading.tsx'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapComponentProps {
    sport: string
    season: number
}

const fetchStadiums = async (sport: string, season: number) => {
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Stadium/filterBySeason/${season}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export const MapComponent = ({ sport, season }: MapComponentProps) => {
    const {
        data: stadiums,
        error,
        isLoading,
        isSuccess
    } = useQuery<IStadium[]>({
        queryKey: ['stadiums', sport, season],
        queryFn: () => fetchStadiums(sport, season)
    })

    if (error) return <h2>Error: {error.message}</h2>

    if (isLoading) return <Loading />

    if (!isSuccess) return <h2>No data</h2>

    const positions: LatLng[] = stadiums.map(
        (stadium: IStadium) => new LatLng(stadium.location.coordinates[0], stadium.location.coordinates[1])
    )

    return (
        <div className="h-[40em] w-[50em] border-2 border-gray-300">
            <MapContainer center={[46.0505, 14.8285]} zoom={7.5} className="h-full w-full">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {positions.map((position, index) => (
                    <Marker key={index} position={position}>
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
    )
}