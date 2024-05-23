import { IStanding } from '../interfaces/IStanding.ts'
import { StandingsLineChart } from './StandingsLineChart.tsx'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'

const fetchStandings = async () => {
    const response = await fetch(`${import.meta.env.API_URL}/footballStanding`)
    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }
    return response.json()
}

export const FootballStandingsGraph = () => {
    const { data, error, isLoading, isSuccess } = useQuery<IStanding[]>({
        queryKey: ['footballStandings'],
        queryFn: fetchStandings
    })

    if (isLoading) return <Loading />

    if (error) return <h2>Error: {error.message}</h2>

    if (!isSuccess) return <h2>No data</h2>

    return (
        <div className="flex flex-row justify-center items-center h-[48em] gap-8 m-8">
            <h1 className="text-2xl text-white">Football Standings</h1>
            <StandingsLineChart data={data} />
        </div>
    )
}