import {IStanding} from "../interfaces/IStanding.ts";
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import {CSSProperties, useEffect, useState} from "react";
import {Sport} from "../types/SportType.ts";
import {Loading} from "./Loading.tsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface TeamStatsGraphProps {
    name: string,
    sport: Sport
}

export const TeamStatsGraph = ({name, sport}: TeamStatsGraphProps) => {
    const [data, setData] = useState<IStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTeamStats = () => {
            fetch(`${import.meta.env.API_URL}/${sport}Standing/filterByTeamName/${name}`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    setLoading(false);
                }).catch(error => {
                    setError(error);
                    setLoading(false);
                }
            )
        }
        fetchTeamStats();
    }, [name, sport])


    const barLabels = [2020, 2021, 2022, 2023, 2024] // Use team names as labels
    const datasetWins = {
        label: "Wins",
        data: data.map(standing => standing.wins),
        backgroundColor: 'rgba(53,225,105,0.2)',
        borderColor: 'rgb(20,197,58)',
        borderWidth: 1,
    };

    const datasetDraws = {
        label: "Draws",
        data: data.map(standing => standing.draws),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
    };

    const datasetLosses = {
        label: "Losses",
        data: data.map(standing => standing.losses),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
    };

    const datasetGoalsScored = {
        label: "Goals Scored",
        data: data.map(standing => standing.goalsScored),
        backgroundColor: 'rgba(102,133,255,0.2)',
        borderColor: 'rgb(102,163,255)',
        borderWidth: 1,
    };

    const datasetGoalsConceded = {
        label: "Goals Conceded",
        data: data.map(standing => standing.goalsConceded),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
    };

    const datasetPoints = {
        label: "Points",
        data: data.map(standing => standing.points),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
    };

    const pointsChartData: ChartData = {
        labels: barLabels,
        datasets: [datasetWins, datasetDraws, datasetLosses],
    };

    const goalsChartData: ChartData = {
        labels: barLabels,
        datasets: [datasetGoalsScored, datasetGoalsConceded, datasetPoints],
    };

    const graphStyle: CSSProperties = {
        height: "auto",
        width: "40em",
        backgroundColor: "#030303",
        border: "2px solid #f3f3f3",
        borderRadius: "2em",
        padding: "1em",
    }

    if (error) return <h2>Error: {error}</h2>;

    if (loading) return <Loading />;

    return (
        <div className="m-4 p-8 bg-gray-500 rounded-xl">
            <h1 className="mb-4">{data[0].team.name} Stats</h1>
            <div className="flex flex-row justify-center items-center gap-8">
                <div style={graphStyle}>
                    <Bar data={pointsChartData}/>
                </div>
                <div style={graphStyle}>
                    <Bar data={goalsChartData}/>
                </div>
            </div>
        </div>
    );
}