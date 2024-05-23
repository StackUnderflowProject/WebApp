import { useState } from 'react'
import { IHandballTeam } from '../interfaces/IHandballTeam.ts'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'
import { HandballTeamSimple } from './HandballTeamSimple.tsx'

const fetchHandballTeams = async (season: number) => {
    const response = await fetch(`${import.meta.env.API_URL}/handballTeam/filterBySeason/${season}`)
    if (!response.ok) throw new Error('Failed to fetch handball teams')
    return await response.json()
}

export const HandballTeamList = () => {
    const [season, setSeason] = useState<number>(2024)

    const { data, error, isLoading, isSuccess } = useQuery<IHandballTeam[]>({
        queryKey: ['handballTeams', season],
        queryFn: () => fetchHandballTeams(season)
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
            <h1 className="text-2xl">Handball Teams {season}</h1>
            {!isSuccess ? (
                <h2>No data available</h2>
            ) : isLoading ? (
                <Loading />
            ) : (
                <div className="flex flex-wrap">
                    {data.map((team: IHandballTeam) => (
                        <HandballTeamSimple key={team._id} team={team} />
                    ))}
                </div>
            )}
        </div>
    )
}