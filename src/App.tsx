import './App.css';
import {TeamStatsGraph} from "./components/TeamStatsGraph.tsx";
import {useEffect, useState} from "react";
import {IStanding} from "./interfaces/IStanding.ts";
import {FootballStandingsGraph} from "./components/FootballStandingsGraph.tsx";
import {HandballStandingsGraph} from "./components/HandballStandingsGraph.tsx";

function App() {
    const [teamData, setTeamData] = useState<IStanding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const name = "Maribor";

    useEffect(() => {
        const fetchData = () => {
            fetch(`${import.meta.env.API_URL}/footballStanding`)
                .then(response => response.json())
                .then(data => {
                    setTeamData(data.filter((team: IStanding) => team.team.name.includes(name)))
                    setLoading(false);
                });
        }
        fetchData();
    }, [name]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            <TeamStatsGraph data={teamData} />
            {/*<FootballStandingsGraph />*/}
            {/*<HandballStandingsGraph />*/}
        </>
    );
}

export default App;