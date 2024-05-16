export interface IFootballTeam {
    _id: string,
    name: string,
    president: string | null,
    director: string | null,
    coach: string,
    logoPath: string,
    season: number,
}