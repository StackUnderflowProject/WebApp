import React, { useState, useEffect } from 'react'
import { Sport } from '../types/SportType.ts'
import { IStanding } from '../interfaces/IStanding.ts'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'

const fetchStandings = async (sport: Sport, season: number) => {
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Standing/filterBySeason/${season}`)
    if (!response.ok) {
        throw new Error('Failed to fetch standings')
    }
    return response.json()
}

function Standings() {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const [season, setSeason] = useState(() => {
        const storedSeason = Number(localStorage.getItem('seasonStandingsF'))
        return storedSeason ? storedSeason : currentYear
    })

    const [sport, setSport] = useState<Sport>(() => {
        const storedSport = localStorage.getItem('standingsSportS')
        return storedSport ? (storedSport as Sport) : ('football' as Sport)
    })
    useEffect(() => {
        localStorage.setItem('standingsSportS', sport)
    }, [sport])

    const {
        data: teams,
        isLoading: loading,
        isSuccess,
        isError
    } = useQuery<IStanding[]>({
        queryKey: ['standings', sport, season],
        queryFn: () => fetchStandings(sport, season)
    })

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('seasonStandingsF', season.toString())
    }, [season])

    // CHANGE SPORT FILTER
    const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSport(event.target.value as Sport)
    }

    // CHANGE SEASON FILTER
    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSeason(Number(event.target.value))
    }

    // LOADING SCREEN
    if (isError) return <h2>Error: Failed to fetch data</h2>

    if (loading) return <Loading />

    if (!isSuccess) return <div>No data available</div>

    return (
        <div className="w-full my-8 flex flex-col items-end justify-start gap-4 rounded-xl">
            <div className="flex justify-end gap-4">
                <select
                    onChange={handleSportChange}
                    value={sport}
                    className="p-2 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text rounded-xl"
                >
                    <option value="football">Football</option>
                    <option value="handball">Handball</option>
                </select>
                <select
                    onChange={handleSeasonChange}
                    value={season}
                    className="p-2 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text rounded-xl"
                >
                    {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <table className="w-full h-full table bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl">
                <thead className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text table-row-group rounded-xl">
                    <tr className="rounded-xl">
                        <th className="p-4 rounded-tl-xl border-r">{windowSize.width > 1280 ? 'PLACE' : 'PL.'}</th>
                        <th className="border-r">TEAM</th>
                        <th className="border-r">{windowSize.width > 1280 ? 'GAMES PLAYED' : 'G. P.'}</th>
                        <th className="border-r">{windowSize.width > 1280 ? 'WINS' : 'W.'}</th>
                        <th className="border-r">{windowSize.width > 1280 ? 'DRAWS' : 'D.'}</th>
                        <th className="border-r">{windowSize.width > 1280 ? 'LOSSES' : 'L.'}</th>
                        <th className="border-r">{windowSize.width > 1280 ? 'GOALS' : 'G.'}</th>
                        <th className="rounded-tr-xl">{windowSize.width > 1280 ? 'POINTS' : 'P.'}</th>
                    </tr>
                </thead>
                <tbody className="table-row-group">
                    {teams.map((standing) => (
                        <tr key={standing._id} className="border-t">
                            <td className="border-r text-xl">{standing.place}.</td>
                            <td className="border-r text-xl flex justify-center items-center gap-2 p-4 flex-wrap">
                                <img
                                    src={standing.team.logoPath}
                                    alt={standing.team.name}
                                    className="h-20 w-20 mx-auto rounded-xl min-w-fit"
                                />
                                <span className="w-1/2 min-w-fit">{standing.team.name}</span>
                            </td>
                            <td className="border-r text-xl">{standing.gamesPlayed}</td>
                            <td className="border-r text-xl">{standing.wins}</td>
                            <td className="border-r text-xl">{standing.draws}</td>
                            <td className="border-r text-xl">{standing.losses}</td>
                            <td className="border-r text-xl">
                                {standing.goalsScored}:{standing.goalsConceded}
                            </td>
                            <td className="text-xl">{standing.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Standings