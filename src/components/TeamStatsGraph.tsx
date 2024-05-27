import { IStanding } from '../interfaces/IStanding.ts'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartDataset
} from 'chart.js'
import { Sport } from '../types/SportType.ts'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useThemePreference } from '../hooks/useThemePreference.ts'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface TeamStatsGraphProps {
    name: string
    sport: Sport
}

const fetchTeamStats = async (name: string, sport: Sport) => {
    if (!name) throw new Error('Team name is required')
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Standing/filterByTeamName/${name}`)
    if (!response.ok) {
        throw new Error('Failed to fetch team stats')
    }
    return await response.json()
}

export const TeamStatsGraph = ({ name, sport }: TeamStatsGraphProps) => {
    const {
        data,
        error,
        isLoading: loading,
        isSuccess
    } = useQuery<IStanding[]>({
        queryKey: [`${sport}TeamStats`, name, sport],
        queryFn: () => fetchTeamStats(name, sport)
    })

    const theme = useThemePreference()
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

    if (error) return <h2>Error: {error.message}</h2>

    if (loading) return <Loading />

    if (!isSuccess) return <h2>No data available</h2>

    const uniqueYears = Array.from(new Set(data.map((standing) => standing.season)))
    const sortedYears = uniqueYears.sort((a, b) => a - b)

    const getDataForYear = (year: number, key: keyof IStanding) => {
        const standing = data.find((s) => s.season === year)
        return standing ? standing[key] : 0
    }

    const datasetWins: ChartDataset = {
        label: 'Wins',
        data: sortedYears.map((year) => getDataForYear(year, 'wins')),
        backgroundColor: 'rgba(53,225,105)',
        borderColor: 'rgb(14,157,57)',
        borderWidth: 1
    }

    const datasetDraws: ChartDataset = {
        label: 'Draws',
        data: sortedYears.map((year) => getDataForYear(year, 'draws')),
        backgroundColor: 'rgba(255, 206, 86)',
        borderColor: 'rgb(255,158,60)',
        borderWidth: 1
    }

    const datasetLosses: ChartDataset = {
        label: 'Losses',
        data: sortedYears.map((year) => getDataForYear(year, 'losses')),
        backgroundColor: 'rgba(255, 99, 132)',
        borderColor: 'rgb(255,64,106)',
        borderWidth: 1
    }

    const datasetGoalsScored: ChartDataset = {
        label: 'Goals Scored',
        data: sortedYears.map((year) => getDataForYear(year, 'goalsScored')),
        backgroundColor: 'rgba(102,133,255)',
        borderColor: 'rgb(58,120,253)',
        borderWidth: 1
    }

    const datasetGoalsConceded: ChartDataset = {
        label: 'Goals Conceded',
        data: sortedYears.map((year) => getDataForYear(year, 'goalsConceded')),
        backgroundColor: 'rgba(255, 159, 64)',
        borderColor: 'rgb(255,136,39)',
        borderWidth: 1
    }

    const datasetPoints: ChartDataset = {
        label: 'Points',
        data: sortedYears.map((year) => getDataForYear(year, 'points')),
        backgroundColor: 'rgba(255, 99, 132)',
        borderColor: 'rgb(250,50,92)',
        borderWidth: 1
    }

    const pointsChartData: ChartData = {
        labels: sortedYears,
        datasets: [datasetWins, datasetDraws, datasetLosses]
    }

    const goalsChartData: ChartData = {
        labels: sortedYears,
        datasets: [datasetGoalsScored, datasetGoalsConceded, datasetPoints]
    }

    const graphOptions = {
        scales: {
            y: {
                ticks: {
                    step: 50,
                    color: theme === 'dark' ? '#fff' : '#000'
                }
            },
            x: {
                ticks: {
                    color: theme === 'dark' ? '#fff' : '#000'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 14,
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }

    return (
        <div className="xl:mt-8 h-[96%] rounded-xl flex flex-col gap-4">
            <div className="h-1/3 text-center flex flex-row gap-4 ">
                <div className="w-full h-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl ">
                    <h1 className="text-light-text dark:text-dark-text text-3xl xl:mt-8 mt-4 mb-4">
                        {data[0].team.name} Stats
                    </h1>
                    <p className="text-light-text dark:text-dark-text text-xl mt-4">Coach: {data[0].team.coach}</p>
                    <p className="text-light-text dark:text-dark-text text-xl mt-4">
                        President: {data[0].team.president}
                    </p>
                    <p className="text-light-text dark:text-dark-text text-xl mt-4">
                        Director: {data[0].team.director}
                    </p>
                </div>
                <img src={data[0].team.logoPath} alt={data[0].team.name} className="h-auto w-auto rounded-xl mx-auto" />
            </div>
            <div className="flex flex-row h-2/3 justify-center w-full gap-4">
                <div className="p-4 rounded-xl w-full xl:h-full h-96 bg-light-background dark:bg-dark-background">
                    <Bar
                        data={pointsChartData}
                        options={graphOptions}
                        key={windowSize.width + pointsChartData.datasets.length}
                    />
                </div>
                <div className="p-4 rounded-xl w-full xl:h-full h-96 bg-light-background dark:bg-dark-background">
                    <Bar
                        data={goalsChartData}
                        options={graphOptions}
                        key={windowSize.width + goalsChartData.datasets.length}
                    />
                </div>
            </div>
        </div>
    )
}