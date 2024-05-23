import { useState, useEffect } from 'react'; 
import LoadingScreen from './LoadingScreen';
import '../stylesheets/standings.css';

type StandingsUnit = {
    _id: string,
    place: number,
    team: {
        _id: string,
        name: string,
        president: string,
        director: string,
        coach: string,
        logoPath: string,
        season: number,
        __v: number
    },
    gamesPlayed: number,
    wins: number,
    draws: number,
    losses: number,
    goalsScored: number,
    goalsConceded: number,
    points: number,
    season: number,
    __v: number
};

function Standings() {
    const [teams, setTeams] = useState<StandingsUnit[]>([]);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [season, setSeason] = useState(() => {
        const storedSeason = Number(localStorage.getItem("seasonStandingsF"));
        return storedSeason ? storedSeason : currentYear;
    });
    useEffect(() => {
        localStorage.setItem("seasonStandingsF", season.toString());
    }, [season]);

    const [sport, setSport] = useState(() => {
        const storedSport = localStorage.getItem("standingsSportS");
        return storedSport ? storedSport : "nogomet";
    });
    useEffect(() => {
        localStorage.setItem("standingsSportS", sport);
    }, [sport]);

    const getFootballStandings = async (year: number) => {
        try {
            const response = await fetch('http://localhost:3000/footballStanding/filterBySeason/' + year);
            const data = await response.json();
            if (response.ok) {
                setTeams(data);
            } else {
                console.error('Failed to fetch football standings');
            }
        } catch (error) {
            console.error('Error fetching football standings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHandballStandings = async (year: number) => {
        try {
            const response = await fetch('http://localhost:3000/handballStanding/filterBySeason/' + year);
            const data = await response.json();
            if (response.ok) {
                setTeams(data);
            } else {
                console.error('Failed to fetch handball standings');
            }
        } catch (error) {
            console.error('Error fetching handball standings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (sport === "nogomet") {
            getFootballStandings(season);
        } else {
            getHandballStandings(season);
        }
    }, [sport, season]);

    // CHANGE SPORT FILTER
    const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSport(event.target.value);
    };

    // CHANGE SEASON FILTER
    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSeason(Number(event.target.value));
    };

    // LOADING SCREEN
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="center-wrapper">
            <div className="content-container">
                <div className="filters">
                    <div className="filter-display">
                        <h1 id="sport-filter-label">{sport.toUpperCase()}</h1>
                        <h1>Sezona: {season}</h1>
                    </div>
                    <div className="select-container2">
                        <select id="sport-filter2" onChange={handleSportChange} value={sport}>
                            <option value="nogomet">Nogomet</option>
                            <option value="rokomet">Rokomet</option>
                        </select>
                    </div>
                    <div className="select-container2">
                        <select id="sport-filter2" onChange={handleSeasonChange} value={season}>
                            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <table className="standings-table">
                    <thead>
                        <tr>
                            <th>MESTO</th>
                            <th>LOGO</th>
                            <th>IME EKIPE</th>
                            <th>ODIGRANE IGRE</th>
                            <th>ZMAGE</th>
                            <th>NEODLOČENE</th>
                            <th>PORAZI</th>
                            <th>GOLI</th>
                            <th>TOČKE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((standing) => (
                            <tr key={standing._id}>
                                <td>{standing.place}.</td>
                                <td>
                                    <img
                                        src={standing.team.logoPath}
                                        alt={standing.team.name}
                                        className="team-logo"
                                    />
                                </td>
                                <td>{standing.team.name}</td>
                                <td>{standing.gamesPlayed}</td>
                                <td>{standing.wins}</td>
                                <td>{standing.draws}</td>
                                <td>{standing.losses}</td>
                                <td>{standing.goalsScored}:{standing.goalsConceded}</td>
                                <td>{standing.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Standings;
