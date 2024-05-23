import {useEffect, useState} from "react";
import {IHandballTeam} from "../interfaces/IHandballTeam.ts";
import {HandballTeam} from "./HandballTeam.tsx";
import {Loading} from "./Loading.tsx";

export const HandballTeamList = () => {
    const [season, setSeason] = useState<number>(2024)
    const [data, setData] = useState<IHandballTeam[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = () => {
            fetch(`${import.meta.env.API_URL}/handballTeam/filterBySeason/${season}`)
                .then(response => response.json())
                .then(data => {
                    setData(data)
                    setLoading(false)
                }).catch(error => {
                    setError(error)
                }
            )
        };
        fetchData();
    }, [season]); // Only depends on season

    if (error) return <h2>Error: {error}</h2>

    return (
        <>
            <button onClick={() => {
                setLoading(true)
                setSeason(season - 1)
            }}>Previous
            </button>
            <button onClick={() => {
                setLoading(true)
                setSeason(season + 1)
            }}>Next
            </button>
            <h1>Handball Teams {season}</h1>
            {loading ? <Loading/> : <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {data.map((team: IHandballTeam) => (
                    <HandballTeam key={team._id} team={team}/>
                ))}
            </div>}
        </>
    );
}