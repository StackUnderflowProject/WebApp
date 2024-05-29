export interface IMatch {
    _id: string
    date: string
    time: string
    home: {
        _id: string
        name: string
        logoPath: string
    }
    away: {
        _id: string
        name: string
        logoPath: string
    }
    score: string
    location: string
    // stadium: {
    //     name: string
    //     location: {
    //         type: 'Point'
    //         coordinates: [number]
    //     }
    // }
    season: number
    __v: number
}