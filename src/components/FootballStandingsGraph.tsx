import {useState, useEffect} from "react";
import {IStanding} from "../interfaces/IStanding.ts";
import {StandingsLineChart} from "./StandingsLineChart.tsx";

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

    if (loading) return <h2>Loading...</h2>;

    return (
        <div style={
            {
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "95vh",
                gap: "2em",
            }
        }>
            <h1>Football Standings</h1>
            <StandingsLineChart data={data}/>
        </div>
    );
}