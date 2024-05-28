import { ChangeEvent, useEffect, useState } from 'react'
import { MatchesMap } from './MatchesMap'
import { Sport } from '../types/SportType'
import { StadiumMap } from './StadiumMap'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading'
import { Season } from '../types/SeasonType'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation() // Initialize translation
    const [selectedOption, setSelectedOption] = useState<Option>(() => {
        const option = localStorage.getItem('selectedOptionHome') as Option
        return option || 'stadiums'
    })

    const [season, setSeason] = useState<Season>(() => {
        const season = localStorage.getItem('seasonHome')
        return season ? (parseInt(season, 10) as Season) : (2024 as Season)
    })

    const [sport, setSport] = useState<Sport>(() => {
        const sport = localStorage.getItem('sportHome')
        return (sport as Sport) || ('football' as Sport)
    })

    const [fromDate, setFromDate] = useState<string>(() => {
        const fromDate = localStorage.getItem('fromDateHome')
        return fromDate || lastWeek()
    })

    const [toDate, setToDate] = useState<string>(() => {
        const toDate = localStorage.getItem('toDateHome')
        return toDate || new Date().toISOString().split('T')[0]
    })

    const [team, setTeam] = useState<string>(() => {
        const team = localStorage.getItem('teamHome')
        return team || ''
    })

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

    useEffect(() => {
        localStorage.setItem('selectedOptionHome', selectedOption)
        localStorage.setItem('seasonHome', season.toString())
        localStorage.setItem('sportHome', sport)
        localStorage.setItem('fromDateHome', fromDate)
        localStorage.setItem('toDateHome', toDate)
        localStorage.setItem('teamHome', team)
    }, [selectedOption, season, sport, fromDate, toDate, team])

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
            <aside className="bg-light-background dark:bg-dark-background xl:w-1/5 p-4 rounded-xl text-left h-fit">
                <select
                    className="bg-light-primary text-light-text dark:bg-dark-primary dark:text-dark-text p-2 rounded-xl w-full cursor-pointer h-fit"
                    value={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value="stadiums">{t('home_page.stadiums')}</option>
                    <option value="matches">{t('home_page.matches')}</option>
                </select>
                <div className="flex flex-row xl:flex-col gap-4 h-fit">
                    <div className="bg-light-primary text-light-text dark:bg-dark-primary dark:text-dark-text flex flex-col justify-center items-left gap-2 mt-4 w-full h-fit p-4 rounded-xl">
                        <h1 className="text-light-text dark:text-dark-text">
                            {selectedOption === 'stadiums'
                                ? t('home_page.stadium_options')
                                : t('home_page.match_options')}
                        </h1>
                        <select
                            value={sport}
                            onChange={handleSportChange}
                            className="p-2 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text cursor-pointer"
                        >
                            <option value="football">{t('football')}</option>
                            <option value="handball">{t('handball')}</option>
                        </select>
                        {selectedOption === 'stadiums' && (
                            <select
                                value={season}
                                onChange={handleSeasonChange}
                                className="p-2 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text cursor-pointer"
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
                                    className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2 rounded-xl"
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                />
                                <input
                                    type="date"
                                    className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2 rounded-xl"
                                    value={toDate}
                                    onChange={handleToDateChange}
                                />
                            </div>
                        )}
                    </div>
                    <div className="bg-light-primary text-light-text dark:bg-dark-primary dark:text-dark-text p-4 mt-4 xl:mt-0 rounded-xl flex flex-col gap-2 h-fit w-full">
                        <h1 className="text-light-text dark:text-dark-text">{t('home_page.team_options')}</h1>
                        {teamsError && <p>{t('error_fetching_teams')}</p>}
                        {isLoading && <Loading />}
                        {isSuccess && (
                            <select
                                className="p-2 rounded-xl bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text cursor-pointer"
                                onChange={handleTeamChange}
                            >
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