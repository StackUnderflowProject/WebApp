export interface IStadium {
    _id: string
    name: string
    capacity: number
    location: {
        type: 'Point'
        coordinates: [number, number]
    }
    teamId: {
        _id: string
        name: string
    }
    buildYear: number
    imageUrl: string
    season: string
    sport?: string
}