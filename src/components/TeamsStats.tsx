import {useEffect, useState} from "react";
import {IFootballTeam} from "../interfaces/IFootballTeam.ts";
import {Sport} from "../types/SportType.ts";
import {TeamStatsGraph} from "./TeamStatsGraph.tsx";
import {Loading} from "./Loading.tsx";

export const TeamsStats = () => {
    const [footballTeamNames, setFootballTeamNames] = useState<Set<string>>(new Set());
    const [handballTeamNames, setHandballTeamNames] = useState<Set<string>>(new Set());
    const [selectedSport, setSelectedSport] = useState<Sport>("football");
    const [selectedTeam, setSelectedTeam] = useState<string>("Maribor");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFootballTeamNames = () => {
            fetch(`${import.meta.env.API_URL}/footballTeam`)
                .then(response => response.json())
                .then(data => {
                    setFootballTeamNames(new Set<string>(data.map((team: IFootballTeam) => team.name)))
                    setLoading(false);
                }).catch(error => {
                    setError(error);
                    setLoading(false);
                }
            )
        }
        const fetchHandballTeamNames = () => {
            setLoading(true)
            fetch(`${import.meta.env.API_URL}/handballTeam`)
                .then(response => response.json())
                .then(data => {
                    setHandballTeamNames(new Set<string>(data.map((team: IFootballTeam) => team.name)))
                    setLoading(false);
                }).catch(error => {
                    setError(error);
                    setLoading(false);
                }
            )
        }
        fetchFootballTeamNames()
        fetchHandballTeamNames()
    }, []);

    useEffect(() => {
        setSelectedTeam("")
    }, [selectedSport]);

    if (error) return <h2>Error: {error}</h2>;

    if (loading) return <Loading />;

    return (
        <div className="text-center p-4 m-4 bg-amber-600 rounded-xl">
            <h1 className="mb-4">Team Stats</h1>
            <div className="m-4 flex gap-8 text-2xl">
                <h2>Choose a sport:</h2>
                <select
                    title="Sport"
                    value={selectedSport}
                    onChange={(event) => setSelectedSport(event.target.value as Sport)}
                    className="pl-4 pr-4 pt-2 pb-2 rounded-xl"
                >
                    <option value="football">Football</option>
                    <option value="handball">Handball</option>
                </select>
            </div>
            {selectedSport === "football" && (
                <div className="m-4 flex gap-8 text-2xl">
                    <h2>Football</h2>
                    <select
                        title="Football teams"
                        value={selectedTeam}
                        onChange={(event) => setSelectedTeam(event.target.value)}
                        className="pl-4 pr-4 pt-2 pb-2 rounded-xl"
                    >
                        <option></option>
                        {[...footballTeamNames].map((teamName, index) => (
                            <option key={index} value={teamName}>{teamName}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedSport === "handball" && (
                <div className="m-4 flex gap-8 text-2xl">
                    <h2>Handball</h2>
                    <select
                        title="Handball teams"
                        value={selectedTeam}
                        onChange={(event) => setSelectedTeam(event.target.value)}
                    >
                        <option></option>
                        {[...handballTeamNames].map((teamName, index) => (
                            <option key={index} value={teamName}>{teamName}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedTeam.length > 0 && <TeamStatsGraph name={selectedTeam} sport={selectedSport}/>}
        </div>
    )
}