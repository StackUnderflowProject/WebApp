import {useState, useEffect} from "react";
import {IStanding} from "../interfaces/IStanding.ts";
import {StandingsLineChart} from "./StandingsLineChart.tsx";

export const HandballStandingsGraph = () => {
    const [data, setData] = useState<IStanding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = () => {
            fetch(`${import.meta.env.API_URL}/handballStanding`)
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
                width: "100%",
                height: "95vh",
                gap: "2em",
            }
        }>
            <h1>Handball Standings</h1>
            <StandingsLineChart data={data}/>
        </div>
    );
}