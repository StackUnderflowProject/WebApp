export interface IStanding {
    _id: string;
    place: number;
    team: {
        _id: string;
        name: string;
        logoPath: string;
    };
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
    points: number;
    season: number;
}