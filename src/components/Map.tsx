import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {LatLng} from 'leaflet';

// Fix for default icon issues with Leaflet in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useState} from "react";
import {IStadium} from "../interfaces/IStadium.ts";
import {Loading} from "./Loading.tsx";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    sport: string,
    season: number
}

export const MapComponent = ({sport, season}: MapComponentProps) => {
    const [stadiums, setStadiums] = useState<IStadium[]>([]); // Example state for stadiums
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [positions, setPositions] = useState<LatLng[]>([]); // Example state for positions of stadiums

    useEffect(() => {
        const fetchStadiums = () => {
            fetch(`${import.meta.env.API_URL}/${sport}Stadium/filterBySeason/${season}`)
                .then(response => response.json())
                .then(data => {
                    setStadiums(data);
                    console.log(data)
                    setLoading(false);
                    setPositions(data.map((stadium: IStadium) => new LatLng(stadium.location.coordinates[0], stadium.location.coordinates[1])));
                }).catch(error => {
                    setError(error);
                    setLoading(false);
                }
            )
        }
        fetchStadiums();
    }, [sport, season]);

    if (error) return <h2>Error: {error}</h2>;

    if (loading) return <Loading />;

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
                                    <img src={stadiums[index].imageUrl} alt={stadiums[index].name}
                                         className="h-36 max-h-full w-auto rounded-lg"/>
                                )}
                                {stadiums[index].capacity && (
                                    <h4 className="text-base mt-2">
                                        Capacity: {stadiums[index].capacity}
                                        <br/>
                                        Build Year: {stadiums[index].buildYear}
                                    </h4>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};