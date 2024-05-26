import { IFootballTeam } from './IFootballTeam.ts'
import { IHandballTeam } from './IHandballTeam.ts'
import { IStadium } from './IStadium.ts'

export interface IMatch {
    _id: string
    date: string
    time: string
    home: IFootballTeam | IHandballTeam
    away: IFootballTeam | IHandballTeam
    score: string
    location: string
    stadium: IStadium
    season: number
    __v: number
}