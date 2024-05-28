import { FootballStandingsGraph } from './FootballStandingsGraph.tsx'
import { HandballStandingsGraph } from './HandballStandingsGraph.tsx'
import { ChangeEvent, useEffect, useState } from 'react'
import { Sport } from '../types/SportType.ts'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'
import { TeamStatsGraph } from './TeamStatsGraph.tsx'

type Option = 'standings' | 'clubs'

const fetchTeamNames = async (sport: Sport) => {
    const response = await fetch(`http://localhost:3000/${sport}Team/name`)
    if (!response.ok) {
        throw new Error('Failed to fetch teams')
    }
    return response.json()
}

export const GraphPage = () => {
    useEffect(() => {
        localStorage.setItem("lastPath", "/graphs");
    }, [])

    const [selectedSport, setSelectedSport] = useState<Sport>(() => {
        const sport = localStorage.getItem('sportGraph')
        return (sport as Sport) || ('football' as Sport)
    })
    const [selectedOption, setSelectedOption] = useState<Option>(() => {
        const option = localStorage.getItem('selectedOptionGraph')
        return (option as Option) || ('standings' as Option)
    })
    const [selectedTeam, setSelectedTeam] = useState<string>(() => {
        const team = localStorage.getItem('teamGraph')
        return team || ''
    })
    const {
        data: teamNames,
        error,
        isLoading,
        isSuccess
    } = useQuery<string[]>({
        queryKey: ['teamNames', selectedSport],
        queryFn: () => fetchTeamNames(selectedSport)
    })

    const handleSportChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSport(e.target.value as Sport)
    }

    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as Option)
    }

    const handleTeamChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeam(e.target.value)
    }

    useEffect(() => {
        setSelectedTeam('')
    }, [selectedSport, selectedOption])

    useEffect(() => {
        localStorage.setItem('selectedOptionGraph', selectedOption)
        if (selectedOption === 'clubs') {
            localStorage.setItem('teamGraph', selectedTeam)
        }
        localStorage.setItem('sportGraph', selectedSport)
    }, [selectedTeam, selectedSport, selectedOption])

    return (
        <div className="flex xl:flex-row flex-col w-full xl:h-[88%] h-[92%] gap-6">
            <div className="w-full xl:w-1/4 h-fit bg-light-primary dark:bg-dark-primary p-4 mt-8 rounded-xl flex flex-col gap-4">
                <select
                    className="text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background p-2 rounded-xl h-fit w-full"
                    onChange={handleOptionChange}
                    value={selectedOption}
                >
                    <option value="standings">Standings</option>
                    <option value="clubs">Clubs</option>
                </select>
                <div className="flex flex-row xl:flex-col justify-center items-center gap-4 w-full">
                    <div className="flex justify-center items-center w-full gap-4">
                        <span className="p-2">Sport:</span>
                        <select
                            className="text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background p-2 rounded-xl h-fit w-full"
                            onChange={handleSportChange}
                        >
                            <option value="football">Football</option>
                            <option value="handball">Handball</option>
                        </select>
                    </div>
                    {selectedOption === 'clubs' && (
                        <div className="flex justify-center items-center gap-4 w-full">
                            <span className="p-2">Clubs:</span>
                            <select
                                className="text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background p-2 rounded-xl h-fit w-full"
                                onChange={handleTeamChange}
                            >
                                <option></option>
                                {isSuccess && [...new Set(teamNames)].map((team) => <option key={team}>{team}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full xl:w-3/4 h-full xl:h-full">
                {selectedOption === 'standings' &&
                    (selectedSport === 'football' ? <FootballStandingsGraph /> : <HandballStandingsGraph />)}

                {selectedOption === 'clubs' && selectedTeam === '' && (
                    <div className="h-full w-full xl:mt-8 bg-transparent border-2 rounded-xl grid place-content-center">
                        <h2 className="text-3xl">Select a team</h2>
                    </div>
                )}
                {selectedOption === 'clubs' && selectedTeam !== '' && (
                    <>
                        {isLoading && <Loading />}
                        {error && <h2>Error: {error.message}</h2>}
                        <TeamStatsGraph name={selectedTeam} sport={selectedSport} />
                    </>
                )}
            </div>
        </div>
    )
}