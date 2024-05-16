import { CSSProperties } from "react";
import {IHandballTeam} from "../interfaces/IHandballTeam.ts";

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

interface HandballTeamProps {
    team: IHandballTeam
}

export const HandballTeam = ({team}: HandballTeamProps) => {
    return (
        <div style={clubCardStyle}>
            <img src={team.logoPath} alt={team.name} style={imgStyle} />
            <h2>{team.name}</h2>
            <p>Coach: {team.coach}</p>
        </div>
    );
}