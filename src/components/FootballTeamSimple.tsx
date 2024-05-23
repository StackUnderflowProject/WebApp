import { IFootballTeam } from '../interfaces/IFootballTeam.ts'

interface FootballTeamProps {
    team: IFootballTeam
}

export const FootballTeamSimple = ({ team }: FootballTeamProps) => {
    return (
        <div className="flex flex-col items-center justify-center border border-gray-400 p-4 m-4 rounded-xl w-56 bg-gray-700">
            <img src={team.logoPath} alt={team.name} className="w-28 h-28 rounded-full" />
            <h2>{team.name}</h2>
            <p>President: {team.president}</p>
            <p>Director: {team.director}</p>
            <p>Coach: {team.coach}</p>
        </div>
    )
}