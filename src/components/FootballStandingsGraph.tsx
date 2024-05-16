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
        <div style={{height: "50em"}}>
            <h1>Football Standings</h1>
            <StandingsLineChart data={data}/>
            {false && <StandingsTable data={data}/>}
        </div>
    );
}

const StandingsTable = ({data}: { data: IStanding[]}) => {
    return <table>
        <thead>
        <tr>
            <th>Season</th>
            <th>Place</th>
            <th>Team</th>
            <th>Logo</th>
            <th>Points</th>
        </tr>
        </thead>
        <tbody>
        {data.filter((standing: IStanding) => standing.season === 2024)
            .map((standing: IStanding) => (
                <tr key={standing._id}>
                    <td>{standing.season}</td>
                    <td>{standing.place}</td>
                    <td>{standing.team.name}</td>
                    <td><img src={standing.team.logoPath} alt={standing.team.name}
                             style={{height: "3em", width: "auto"}}/></td>
                    <td>{standing.points}</td>
                </tr>
            ))}
        </tbody>
    </table>
}