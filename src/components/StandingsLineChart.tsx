import { Line } from 'react-chartjs-2'
import {
    ChartData,
    ChartOptions,
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ChartDataset
} from 'chart.js'
import { IStanding } from '../interfaces/IStanding.ts'
import { useEffect, useState } from 'react'
import { useThemePreference } from '../hooks/useThemePreference.ts'

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip)

interface StandingsLineChartProps {
    data: IStanding[]
}

export const StandingsLineChart = ({ data }: StandingsLineChartProps) => {
    // Prepare datasets for each club based on provided data
    const clubDatasets: Record<string, ChartDataset> = {}
    const labels = [2020, 2021, 2022, 2023, 2024] // Assuming fixed years for the chart

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

    // Iterate over standings data to populate datasets
    data.forEach((standing: IStanding) => {
        const clubName = standing.team.name

        if (!clubDatasets[clubName]) {
            const logo = new Image(50, 50)
            logo.src = standing.team.logoPath

            // Initialize data array with null values for each year
            const dataPoints: (number | null)[] = labels.map(() => null)

            // Insert place data at the corresponding year (season)
            const yearIndex = labels.indexOf(standing.season)
            if (yearIndex !== -1) {
                dataPoints[yearIndex] = standing.place // Set place at the correct year index
            }

            clubDatasets[clubName] = {
                label: clubName,
                data: dataPoints,
                fill: false,
                borderColor: `rgb(${Math.floor(Math.random() * 128 + 50)}, ${Math.floor(
                    Math.random() * 128 + 50
                )}, ${Math.floor(Math.random() * 128 + 50)})`, // Random color for each club
                tension: 0.0,
                pointStyle: logo,
                pointRadius: 50,
                pointHoverRadius: 50
            }
        } else {
            // Update existing dataset with place data at the corresponding year
            const yearIndex = labels.indexOf(standing.season)
            if (yearIndex !== -1) {
                clubDatasets[clubName].data[yearIndex] = standing.place // Update place at the correct year index
            }
        }
    })

    // Convert club datasets object to array of datasets
    const chartData: ChartData = {
        labels: labels,
        datasets: Object.values(clubDatasets)
    }

    // Chart options to configure chart appearance and behavior
    const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: 'category', // Use 'category' scale for x-axis (registered as part of CategoryScale)
                ticks: {
                    padding: 30,
                    color: theme === 'dark' ? '#fff' : '#000'
                }
            },
            y: {
                ticks: {
                    stepSize: 1, // Display integer values on y-axis ticks
                    callback: (value) =>
                        value === 1 ? '1st' : value === 2 ? '2nd' : value === 3 ? '3rd' : `${value}th`, // Customize tick labels
                    padding: 30,
                    color: theme === 'dark' ? '#fff' : '#000'
                },
                reverse: true // Invert y-axis so that higher place is at the top
            }
        }
    }

    return (
        <div className="w-full h-full text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background border-2 rounded-xl">
            {/* @ts-expect-error Chart.js types are not up-to-date*/}
            <Line data={chartData} options={options} key={windowSize.width + chartData.datasets.length} />
        </div>
    )
}