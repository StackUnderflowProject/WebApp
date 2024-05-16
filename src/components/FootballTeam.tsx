import { IFootballTeam } from "../interfaces/FootballTeam";
import { CSSProperties } from "react";

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

export const FootballTeam = (team: IFootballTeam) => {
    return (
        <div style={clubCardStyle}>
            <img src={team.logoPath} alt={team.name} style={imgStyle} />
            <h2>{team.name}</h2>
            <p>President: {team.president}</p>
            <p>Director: {team.director}</p>
            <p>Coach: {team.coach}</p>
        </div>
    );
}