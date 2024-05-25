import { IStanding } from '../interfaces/IStanding.ts'
import { StandingsLineChart } from './StandingsLineChart.tsx'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'

const fetchStandings = async () => {
    const response = await fetch(`${import.meta.env.API_URL}/handballStanding`)
    if (!response.ok) throw new Error('Failed to fetch handball standings')
    return await response.json()
}

export const HandballStandingsGraph = () => {
    const { data, error, isLoading, isSuccess } = useQuery<IStanding[]>({
        queryKey: ['handballStandings'],
        queryFn: fetchStandings
    })

    if (error) return <h2>Error: {error.message}</h2>

    if (isLoading) return <Loading />

    if (!isSuccess) return <h2>No data available</h2>

    return (
        <div className="h-full w-full xl:mt-8">
            <StandingsLineChart data={data} />
        </div>
    )
}