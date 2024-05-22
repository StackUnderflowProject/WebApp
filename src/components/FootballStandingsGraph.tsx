import {useState, useEffect} from "react";
import {IStanding} from "../interfaces/IStanding.ts";
import {StandingsLineChart} from "./StandingsLineChart.tsx";
import {Loading} from "./Loading.tsx";

export const FootballStandingsGraph = () => {
    const [data, setData] = useState<IStanding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = () => {
            fetch(`${import.meta.env.API_URL}/footballStanding`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    setLoading(false);
                });
        }
        fetchData();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="flex flex-row justify-center items-center h-dvh gap-8">
            <h1>Football Standings</h1>
            <StandingsLineChart data={data}/>
        </div>
    );
}