import {useState, useEffect} from "react";
import {IStanding} from "../interfaces/IStanding.ts";
import {StandingsLineChart} from "./StandingsLineChart.tsx";
import {Loading} from "./Loading.tsx";

export const HandballStandingsGraph = () => {
    const [data, setData] = useState<IStanding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = () => {
            fetch(`${import.meta.env.API_URL}/handballStanding`)
                .then(response => response.json())
                .then(data => {
                    setData(data)
                    setLoading(false)
                }).catch(error => {
                setError(error)
            })
        }
        fetchData();
    }, []);

    if (error) return <h2>Error: {error}</h2>

    if (loading) return <Loading/>

    return (
        <div className="flex flex-row justify-center items-center h-dvh gap-8">
            <h1>Handball Standings</h1>
            <StandingsLineChart data={data}/>
        </div>
    );
}