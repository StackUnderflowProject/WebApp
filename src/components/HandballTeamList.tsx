import {useEffect, useState} from "react";
import { IHandballTeam} from "../interfaces/HandballTeam.ts";
import {HandballTeam} from "./HandballTeam.tsx";

export const HandballTeamList = () => {
    const [season, setSeason] = useState<number>(2024);
    const [data, setData] = useState<IHandballTeam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            fetch(`http://20.56.20.111:3000/handballTeam/filterBySeason/${season}`)
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
            <h1>Handball Teams {season}</h1>
            {loading ? <h2>Loading...</h2> : <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {data.map((team: IHandballTeam) => (
                    <HandballTeam key={team._id} {...team}/>
                ))}
            </div>}
        </>
    );
}