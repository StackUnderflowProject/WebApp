import { FootballStandingsGraph } from './FootballStandingsGraph.tsx'
import { HandballStandingsGraph } from './HandballStandingsGraph.tsx'
import { ChangeEvent, useEffect, useState } from 'react'
import { Sport } from '../types/SportType.ts'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'
import { TeamStatsGraph } from './TeamStatsGraph.tsx'
import { useTranslation } from 'react-i18next'

type Option = 'standings' | 'clubs'

const fetchTeamNames = async (sport: Sport) => {
    // changed url
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Team/name`)
    if (!response.ok) {
        throw new Error('Failed to fetch teams')
    }
    return response.json()
}

export const GraphPage = () => {
    useEffect(() => {
        localStorage.setItem('lastPath', '/graphs')
    }, [])

    const { t } = useTranslation()

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
        <div className="flex xl:flex-row flex-col w-full xl:h-[86dvh] h-[100dvh] gap-6 mb-16">
            <div className="w-full xl:w-1/4 h-fit bg-light-primary dark:bg-dark-primary p-4 mt-8 rounded-xl flex flex-col gap-4">
                <select
                    className="text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background p-2 rounded-xl h-fit w-full"
                    onChange={handleOptionChange}
                    value={selectedOption}
                >
                    <option value="standings">{t('graph_page.options.standings')}</option>
                    <option value="clubs">{t('graph_page.options.clubs')}</option>
                </select>
                <div className="flex flex-row xl:flex-col justify-center items-center gap-4 w-full">
                    <div className="flex justify-center items-center w-full gap-4">
                        <span className="p-2 text-light-background dark:text-dark-text">{t('sport')}:</span>
                        <select
                            className="text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background p-2 rounded-xl h-fit w-full"
                            onChange={handleSportChange}
                            value={selectedSport}
                        >
                            <option value="football">{t('football')}</option>
                            <option value="handball">{t('handball')}</option>
                        </select>
                    </div>
                    {selectedOption === 'clubs' && (
                        <div className="flex justify-center items-center gap-4 w-full">
                            <span className="p-2 text-light-background dark:text-dark-text">
                                {t('graph_page.options.clubs')}:
                            </span>
                            <select
                                className="text-light-text bg-light-background dark:text-dark-text dark:bg-dark-background p-2 rounded-xl h-fit w-full"
                                onChange={handleTeamChange}
                                value={selectedTeam}
                            >
                                <option>{t('choose_team')}</option>
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
                    <div className="h-full w-full xl:mt-8 bg-transparent border-2 border-light-accent dark:border-dark-accent rounded-xl grid place-content-center">
                        <h2 className="text-3xl">{t('graph_page.select_team')}</h2>
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