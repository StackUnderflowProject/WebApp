import { useState } from 'react'
import { IFootballTeam } from '../interfaces/IFootballTeam.ts'
import { FootballTeam } from './FootballTeam.tsx'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'

const fetchFootballTeams = async (season: number) => {
    const response = await fetch(`${import.meta.env.API_URL}/footballTeam/filterBySeason/${season}`)
    if (!response.ok) throw new Error('Failed to fetch football teams')
    return await response.json()
}

export const FootballTeamList = () => {
    const [season, setSeason] = useState(2024)

    const { data, error, isLoading, isSuccess } = useQuery<IFootballTeam[]>({
        queryKey: ['footballTeams', season],
        queryFn: () => fetchFootballTeams(season)
    })

    if (error) return <h2>Error: {error.message}</h2>

    return (
        <div className="text-center text-xl text-white">
            <button
                onClick={() => {
                    setSeason(season - 1)
                }}
                className="m-4 p-4 bg-blue-500 rounded-lg"
            >
                Previous
            </button>
            <button
                onClick={() => {
                    setSeason(season + 1)
                }}
                className="m-4 p-4 bg-blue-500 rounded-lg"
            >
                Next
            </button>
            <h1 className="text-2xl">Football Teams {season}</h1>
            {!isSuccess ? (
                <h2>No data available</h2>
            ) : isLoading ? (
                <Loading />
            ) : (
                <div className="flex flex-wrap">
                    {data.map((team: IFootballTeam) => (
                        <FootballTeam key={team._id} team={team} />
                    ))}
                </div>
            )}
        </div>
    )
}