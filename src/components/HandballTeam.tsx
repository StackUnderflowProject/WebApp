import {IHandballTeam} from "../interfaces/IHandballTeam.ts";

interface HandballTeamProps {
    team: IHandballTeam
}

export const HandballTeam = ({team}: HandballTeamProps) => {
    return (
        <div className="flex flex-col items-center justify-center border border-gray-300 p-3 m-3 rounded w-56 bg-gray-800">
            <img src={team.logoPath} alt={team.name} className="w-[100px] h-[100px] rounded-xl" />
            <h2>{team.name}</h2>
            <p>Coach: {team.coach}</p>
        </div>
    );
}