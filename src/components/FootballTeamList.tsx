import {useEffect, useState} from "react";
import {IFootballTeam} from "../interfaces/IFootballTeam.ts";
import {FootballTeam} from "./FootballTeam.tsx";
import {Loading} from "./Loading.tsx";

export const FootballTeamList = () => {
    const [season, setSeason] = useState<number>(2024);
    const [data, setData] = useState<IFootballTeam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            fetch(`${import.meta.env.API_URL}/footballTeam/filterBySeason/${season}`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    setLoading(false);
                });
        };
        fetchData();
    }, [season]); // Only depends on season

    return (
        <>
            <button onClick={() => {
                setLoading(true);
                setSeason(season - 1);
            }}>Previous</button>
            <button onClick={() => {
                setLoading(true);
                setSeason(season + 1);
            }}>Next</button>
            <h1>Football Teams {season}</h1>
            {loading ? <Loading /> : <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {data.map((team: IFootballTeam) => (
                    <FootballTeam key={team._id} team={team}/>
                ))}
            </div>}
        </>
    );
}