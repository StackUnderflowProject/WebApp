import { ChangeEvent, useEffect, useState } from 'react'
import { MatchesMap } from './MatchesMap.tsx'
import { Sport } from '../types/SportType.ts'
import { StadiumMap } from './StadiumMap.tsx'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'
import { Season } from '../types/SeasonType.ts'

type Option = 'stadiums' | 'matches'

const lastWeek = () => {
    const today = new Date()
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
    return lastWeek.toISOString().split('T')[0]
}

const fetchTeams = async (sport: Sport, season: Season) => {
    const response = await fetch(`http://localhost:3000/${sport}Team/name/${season}`)
    if (!response.ok) {
        throw new Error('Failed to fetch teams')
    }
    return response.json()
}

export const HomePage = () => {
    const [selectedOption, setSelectedOption] = useState<Option>('stadiums')
    const [season, setSeason] = useState<Season>(2024)
    const [sport, setSport] = useState<Sport>('football')
    const [fromDate, setFromDate] = useState<string>(lastWeek())
    const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [team, setTeam] = useState<string>('')

    const {
        data: teams,
        error: teamsError,
        isSuccess,
        isLoading
    } = useQuery<string[]>({
        queryKey: ['teams', sport, season],
        queryFn: () => fetchTeams(sport, season)
    })

    useEffect(() => {
        setTeam('')
    }, [season, sport, selectedOption])

    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as Option)
    }

    const handleSeasonChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSeason(parseInt(e.target.value, 10) as Season)
    }

    const handleSportChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSport(e.target.value as Sport)
    }

    const handleFromDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFromDate(e.target.value)
    }

    const handleToDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setToDate(e.target.value)
    }

    const handleTeamChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setTeam(e.target.value)
    }

    return (
        <main className="flex xl:flex-row flex-col justify-center gap-4 mt-4 pt-4 h-[90%] w-full">
            <aside className="bg-blue-300 xl:w-1/5 p-4 rounded-xl text-left">
                <select
                    className="bg-black p-2 rounded-xl w-full cursor-pointer"
                    value={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value={'stadiums'}>Stadiums</option>
                    <option value={'matches'}>Matches</option>
                </select>
                <div className="grid grid-cols-2 grid-rows-1 xl:grid-cols-1 xl:grid-rows-2 gap-4">
                    <div className="flex flex-col justify-center items-left gap-2 mt-4 w-full bg-red-600 p-4 rounded-xl">
                        <h1>{selectedOption === 'stadiums' ? 'Stadium' : 'Match'} Options</h1>
                        <select
                            value={sport}
                            onChange={handleSportChange}
                            className="p-2 rounded-xl bg-black cursor-pointer"
                        >
                            <option value="football">Football</option>
                            <option value="handball">Handball</option>
                        </select>
                        {selectedOption === 'stadiums' && (
                            <select
                                value={season}
                                onChange={handleSeasonChange}
                                className="p-2 rounded-xl bg-black cursor-pointer"
                            >
                                <option value={2020}>2020</option>
                                <option value={2021}>2021</option>
                                <option value={2022}>2022</option>
                                <option value={2023}>2023</option>
                                <option value={2024}>2024</option>
                            </select>
                        )}
                        {selectedOption === 'matches' && (
                            <div className="mt-2 flex flex-col gap-4">
                                <input
                                    type="date"
                                    className="text-black p-2 rounded-xl"
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                />
                                <input
                                    type="date"
                                    className="text-black p-2 rounded-xl"
                                    value={toDate}
                                    onChange={handleToDateChange}
                                />
                            </div>
                        )}
                    </div>
                    <div className="bg-red-600 p-4 mt-4 xl:mt-0 rounded-xl flex flex-col gap-2">
                        <h1>Team Options</h1>
                        {teamsError && <p>Error fetching teams</p>}
                        {isLoading && <Loading />}
                        {isSuccess && (
                            <select className="p-2 rounded-xl bg-black cursor-pointer" onChange={handleTeamChange}>
                                <option></option>
                                {teams?.map((team) => (
                                    <option key={team} value={team}>
                                        {team}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </aside>
            <section className="xl:w-4/5 h-full">
                {selectedOption === 'stadiums' ? (
                    <StadiumMap season={season} sport={sport} team={team} />
                ) : (
                    <MatchesMap sport={sport} fromDate={new Date(fromDate)} toDate={new Date(toDate)} team={team} />
                )}
            </section>
        </main>
    )
}