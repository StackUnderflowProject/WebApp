import {IStanding} from "../interfaces/IStanding.ts";

export const StandingsTable = ({data}: { data: IStanding[]}) => {
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