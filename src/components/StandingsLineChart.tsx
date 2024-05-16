import React from 'react';
import { Line } from 'react-chartjs-2';
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
    Legend,
    ChartDataset
} from 'chart.js';
import { IStanding } from '../interfaces/IStanding.ts';

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StandingsLineChartProps {
    data: IStanding[];
}

export const StandingsLineChart: React.FC<StandingsLineChartProps> = ({ data }) => {
    // Prepare datasets for each club based on provided data
    const clubDatasets: Record<string, ChartDataset> = {};
    const labels = [2020, 2021, 2022, 2023, 2024]; // Assuming fixed years for the chart

    // Iterate over standings data to populate datasets
    data.forEach((standing: IStanding) => {
        const clubName = standing.team.name;

        if (!clubDatasets[clubName]) {
            const logo = new Image(60, 60);
            logo.src = standing.team.logoPath;


            // Initialize data array with null values for each year
            const dataPoints: (number | null)[] = labels.map(() => null);

            // Insert place data at the corresponding year (season)
            const yearIndex = labels.indexOf(standing.season);
            if (yearIndex !== -1) {
                dataPoints[yearIndex] = standing.place; // Set place at the correct year index
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
                pointRadius: 5,
                pointHoverRadius: 10,
            };
        } else {
            // Update existing dataset with place data at the corresponding year
            const yearIndex = labels.indexOf(standing.season);
            if (yearIndex !== -1) {
                clubDatasets[clubName].data[yearIndex] = standing.place; // Update place at the correct year index
            }
        }
    });

    // Convert club datasets object to array of datasets
    const chartData: ChartData = {
        labels: labels,
        datasets: Object.values(clubDatasets),
    };

    // Chart options to configure chart appearance and behavior
    const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Football Standings',
            },
        },
        scales: {
            x: {
                type: 'category', // Use 'category' scale for x-axis (registered as part of CategoryScale)
                title: {
                    display: true,
                    text: 'Year',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Place',
                    padding: { bottom: 10}
                },
                reverse: true, // Invert y-axis so that higher place is at the top
            },
        },
    };

    // Render the Line chart with the configured data and options
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    return (
        <div style={{ width: '80em', height: '90%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};