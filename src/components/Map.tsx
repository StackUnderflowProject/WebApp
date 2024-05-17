import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issues with Leaflet in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useState} from "react";
import {IStadium} from "../interfaces/IStadium.ts";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapComponent = () => {
    const [stadiums, setStadiums] = useState<IStadium[]>([]); // Example state for stadiums
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStadiums = () => {
            fetch(`${import.meta.env.API_URL}/footballStadium/filterBySeason/2024`)
                .then(response => response.json())
                .then(data => {
                    setStadiums(data);
                    console.log(data)
                    setLoading(false);
                });
        }
        fetchStadiums();
    }, []);


    const positions = stadiums.map((stadium: IStadium) => [stadium.location.coordinates[0], stadium.location.coordinates[1]]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <MapContainer center={[46.0505, 14.8285]} zoom={7.5} style={{height: "100%", width: "100%"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {positions.map((position, index) => (
                <Marker key={index} position={position}>
                    <Popup>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <h3>{stadiums[index].name}</h3>
                            {stadiums[index].imageUrl && (
                                <img src={stadiums[index].imageUrl} alt={stadiums[index].name}
                                     style={{
                                         height: "10em",
                                         width: "auto",
                                         borderRadius: "1em"
                                     }}/>)}
                            {stadiums[index].capacity && (<h4>
                                Capacity: {stadiums[index].capacity}
                                <br/>
                                Build Year: {stadiums[index].buildYear}
                            </h4>)}

                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};