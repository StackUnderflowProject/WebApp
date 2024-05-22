import {MapComponent} from './Map'
import {ChangeEvent, useState} from "react";
import {Sport} from "../types/SportType.ts";


const FilterMapComponent = () => {
    const year = new Date().getFullYear();
    const [season, setSeason] = useState(year);
    const [sport, setSport] = useState<Sport>("football");

    const handleSeasonChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSeason(parseInt(event.target.value, 10));
    };

    const handleSportChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSport(event.target.value as Sport);
    }

    return (
        <div className="m-4 p-4 bg-gray-600 rounded-xl">
            <div className="flex flex-row justify-around text-2xl mb-4">
                <select value={season} onChange={handleSeasonChange} className="pl-4 pr-4 pt-2 pb-2 rounded-xl">
                    <option value={2020}>2020</option>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                </select>
                <select value={sport} onChange={handleSportChange} className="pl-4 pr-4 pt-2 pb-2 rounded-xl">
                    <option value="football">Football</option>
                    <option value="handball">Handball</option>
                </select>
            </div>
            <MapComponent sport={sport} season={season}/>
        </div>
    )
}

export default FilterMapComponent;