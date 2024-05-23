//import { CSSProperties } from "react";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import '../stylesheets/team.css';

type Team = {
    _id: string,
    name: string,
    president: string,
    director: string,
    coach: string,
    logoPath: string,
    season?: number,
    __v?: number
}

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

type Match = {
    _id: string;
    date: string;
    time: string;
    home: {
      _id: string;
      name: string;
      president: string;
      director: string;
      coach: string;
      logoPath: string;
      season: number;
      __v: number;
    };
    away: {
      _id: string;
      name: string;
      president: string;
      director: string;
      coach: string;
      logoPath: string;
      season: number;
      __v: number;
    };
    score: string;
    location: string;
    stadium: {
      location: {
        type: string;
        coordinates: [number, number];
      };
      _id: string;
      name: string;
      teamId: string;
      capacity: number;
      buildYear: number;
      imageUrl: string;
      season: number;
      __v: number;
    };
    season: number;
    __v: number;
  };

/*
const clubCardStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #ddd",
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
    width: "200px",
    backgroundColor: "#6e6e6e",
};

const imgStyle: CSSProperties = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
};
*/

export default function HandballTeam() {
    const navigate = useNavigate();
    const { teamId } = useParams();

    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);
    const [teams, setTeams] = useState<StandingsUnit[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [stadiumPicture, setStadiumPicture] = useState<string>("../../public/defaultStadiumImage.jpg");
    
    useEffect(() => {
        if (team !== null) {
            getStadiumLogo();
            getHandballStandings();
            getHandballMatches();
        }
    }, [team])

    const getTeam = async () => {
        try {
            const response = await fetch('http://localhost:3000/handballTeam/latest/' + teamId);
            const data = await response.json();
            if (response.ok) {
                setTeam(data);
            } else {
                console.error('Failed to fetch handball team');
            }
        } catch (error) {
            console.error('Error fetching handball team:', error);
        } finally {
            setLoading(false);
        }
    }

    const getStadiumLogo = async () => {
        try {
            const response = await fetch('http://localhost:3000/handballStadium/getByTeam/' + team?._id);
            const data = await response.json();
            if (response.ok) {
                setStadiumPicture(data.imageUrl);
            } else {
                console.error('Failed to fetch handball stadium');
            }
        } catch (error) {
            console.error('Error fetching handball stadium:', error);
        }
    }

    const getHandballStandings = async () => {
        try {
            const response = await fetch('http://localhost:3000/handballStanding/filterBySeason/' + new Date().getFullYear());
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

    const getHandballMatches = async () => {
        try {
          const response = await fetch('http://localhost:3000/handballMatch/filterByTeamAndSeason/' + new Date().getFullYear() + "/" + team?._id);
          const data = await response.json();
          if (response.ok) {
            const sortedMatches = data.sort((a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setMatches(sortedMatches);
          } else {
            console.error('Failed to fetch handball matches');
          }
        } catch (error) {
          console.error('Error fetching handball matches:', error);
        } finally {
            setLoading(false);
        }
      };

    useEffect(() => {
        setLoading(true);
        getTeam();
    }, [teamId]);

    // LOADING SCREEN
    if (loading) {
        return <LoadingScreen />;
    }

    if (team === null) {
        return (
            <h1>Given team was not found!</h1>
        );
    }
    
    return (
       <>
            <div className="cover-photo">
                <img src={stadiumPicture} alt="Stadium" className="stadium-photo" />
                <div className="profile-details">
                    <img src={team.logoPath} alt={`${team.name} logo`} className="team-logo" />
                    <h1 className="team-name">{team.name}</h1>
                </div>
            </div>
            <div className="team-info">
                <p><strong>{teams.find(standing => standing.team.name === team.name)?.place}. Mesto</strong></p>
                <p><strong>Precednik:</strong> {team.president}</p>
                <p><strong>Direktor:</strong> {team.director}</p>
                <p><strong>Trener:</strong> {team.coach}</p>
            </div>
            
            <div className='stat-container'>
                <div className='standings'>
                    <table className="standings-table-small">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>T</th>
                                    <th>Z</th>
                                    <th>N</th>
                                    <th>P</th>
                                    <th>D:P</th>
                                    <th>T</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((standing) => (
                                    <tr id={standing.team.name === team.name ? "colored-team" : undefined} key={standing._id}>
                                        <td>{standing.place}.</td>
                                        <td>
                                            <img
                                                src={standing.team.logoPath}
                                                alt={standing.team.name}
                                                className="team-logo-small"
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
                <div className="matches-container">
                    <table className="matches-table">
                        <tbody>
                            {matches.map((match) => (
                                <tr id={match.score === "" ? "toBePlayed" : undefined} key={match._id} className="match-row">
                                    <td className="home-name">{match.home.name}</td>
                                    <td>
                                        <div className="center-wrapper-small">
                                            <div onClick={() => navigate("/handballTeam/" + match.home._id)} className="home-team-small">
                                                <img id="team-logo-small" src={match.home.logoPath} alt="home team logo" />
                                            </div>
                                            <div className="score-container-small">
                                                <p id="score-small">{match.score === '' ? '- : -' : match.score}</p>
                                            </div>
                                            <div onClick={() => navigate("/handballTeam/" + match.away._id)} className="away-team-small">
                                                <img id="team-logo-small" src={match.away.logoPath} alt="away team logo" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="away-name">{match.away.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}