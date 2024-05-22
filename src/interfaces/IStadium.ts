export interface IStadium {
    _id: string;
    name: string;
    capacity: number;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    buildYear: number;
    imageUrl: string;
    season: string;
}