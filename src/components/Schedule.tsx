import React, { useState, useEffect } from 'react'
import '../stylesheets/schedule.css'
import { useNavigate } from 'react-router-dom'
import { IMatch } from '../interfaces/IMatch.ts'
import { Sport } from '../types/SportType.ts'
import { Season } from '../types/SeasonType.ts'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'
import { useTranslation } from 'react-i18next'
import { formatDateString } from '../utils/dateUtil.ts'

const fetchMatchCount = async (sport: Sport, season: Season) => {
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Match/countBySeason/${season}`)
    if (!response.ok) {
        throw new Error('Error fetching data')
    }
    return await response.json()
}

const fetchMatches = async (sport: Sport, season: Season, page: number, limit: number) => {
    const response = await fetch(
        `${import.meta.env.API_URL}/${sport}Match/filterBySeason/${season}?page=${page}&limit=${limit}`
    )
    if (!response.ok) {
        throw new Error('Error fetching data')
    }
    return await response.json()
}

export const Schedule = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [sport, setSport] = useState(() => {
        const storedSport = localStorage.getItem('scheduleSportS')
        return storedSport ? (storedSport as Sport) : ('football' as Sport)
    })
    const [season, setSeason] = useState<Season>(() => {
        const storedSeason = localStorage.getItem('scheduleSeasonS')
        return storedSeason ? (parseInt(storedSeason) as Season) : (2024 as Season)
    })

    const [page, setPage] = useState(1)
    const limit = 30

    const {
        data: count = 0,
        error: countError,
        isLoading: countIsLoading,
        isSuccess: countIsSuccess
    } = useQuery<number>({
        queryKey: ['matchCount', sport, season],
        queryFn: () => fetchMatchCount(sport, season)
    })

    const {
        data: matches = [],
        error,
        isLoading,
        isSuccess
    } = useQuery<IMatch[]>({
        queryKey: ['match', sport, season, page, limit],
        queryFn: () => fetchMatches(sport, season, page, limit)
    })

    // const myRef = useRef<HTMLDivElement | null>(null)
    //
    // useEffect(() => {
    //     localStorage.setItem('scheduleSportS', sport)
    //     localStorage.setItem('scheduleSeasonS', season.toString())
    // }, [sport, season])
    //
    // const [showScrollButton, setShowScrollButton] = useState(false)
    // const defaultScrollPositionRef = useRef(0)
    //
    // // SCROLLS TO TODAY MATCHES
    // useEffect(() => {
    //     if (myRef.current) {
    //         const rect = myRef.current.getBoundingClientRect()
    //         const scrollOffset = rect.top + window.scrollY - window.innerHeight / 4
    //         window.scrollTo({ top: scrollOffset, behavior: 'instant' })
    //         defaultScrollPositionRef.current = scrollOffset
    //     }
    // }, [matches])
    //
    // // BUTTON CLICK TO SCROLL TO DEFAULT
    // const scrollToToday = () => {
    //     window.scrollTo({ top: defaultScrollPositionRef.current, behavior: 'smooth' })
    // }
    //
    // // GET SCROLL y POSITION
    // const handleScroll = () => {
    //     const position = window.scrollY
    //     setShowScrollButton(Math.abs(defaultScrollPositionRef.current - position) > 400) // Show button when scrolled down by 400px
    // }
    //
    // useEffect(() => {
    //     localStorage.setItem('lastPath', '/schedule')
    //     window.addEventListener('scroll', handleScroll)
    //     return () => window.removeEventListener('scroll', handleScroll)
    // }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [page])

    // CHANGE SPORT FILTER
    const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSport = event.target.value as Sport
        setSport(selectedSport)
        setPage(1)
    }

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSeason = parseInt(event.target.value) as Season
        setSeason(selectedSeason)
        setPage(1)
    }

    if (error || countError) {
        return <div>{t('schedule.error_fetching_data')}</div>
    }

    // LOADING SCREEN
    if (isLoading || countIsLoading) {
        return <Loading />
    }

    if (!isSuccess || !countIsSuccess) {
        return <div>No data available</div>
    }

    // SORT MATCHES BY DATE
    const matchesByDate = matches.reduce(
        (acc, match) => {
            if (!acc[match.date]) {
                acc[match.date] = []
            }
            acc[match.date].push(match)
            return acc
        },
        {} as Record<string, IMatch[]>
    )

    return (
        <div className="mt-8 relative">
            {/*{showScrollButton && (*/}
            {/*    <button*/}
            {/*        onClick={scrollToToday}*/}
            {/*        className="fixed right-4 bottom-4 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text w-fit p-4 rounded-xl"*/}
            {/*    >*/}
            {/*        <FontAwesomeIcon icon={['fas', 'chevron-up']} />*/}
            {/*    </button>*/}
            {/*)}*/}
            <div className="w-max absolute p-4 right-0 flex gap-2">
                <select
                    onChange={handleSportChange}
                    className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text rounded-xl p-2"
                    value={sport}
                >
                    <option value="football">{t('football')}</option>
                    <option value="handball">{t('handball')}</option>
                </select>
                <select
                    className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text rounded-xl p-2"
                    onChange={handleSeasonChange}
                    value={season}
                >
                    <option value={2020}>2020</option>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                </select>
            </div>
            {Object.entries(matchesByDate).map(([date, dateMatches]) => (
                <div
                    key={date}
                    className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl p-4 my-2 flex flex-col gap-4"
                >
                    <div className="date-container p-2">
                        <h2 className="text-light-text dark:text-dark-text">{formatDateString(date)}</h2>
                    </div>
                    {dateMatches.map((match) => (
                        <div className="flex w-full" key={match._id}>
                            <div
                                className="bg-light-primary dark:bg-dark-primary rounded-xl flex justify-evenly items-center p-4 w-full"
                                id={match._id}
                            >
                                <div
                                    onClick={() => navigate(`/${sport}Team/${match.home._id}/${match.season}`)}
                                    className="w-2/5 flex gap-2 items-center justify-evenly"
                                >
                                    <h2 className="text-light-text dark:text-dark-text text-xl w-1/2">
                                        {match.home.name}
                                    </h2>
                                    <img
                                        className="rounded-xl max-h-20 max-w-20 w-1/2"
                                        src={match.home.logoPath}
                                        alt="home team logo"
                                    />
                                </div>
                                <h1 className="text-2xl p-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl w-1/5">
                                    {match.score === '' ? '- : -' : match.score}
                                </h1>
                                <div
                                    onClick={() => navigate(`/${sport}Team/${match.away._id}/${match.season}`)}
                                    className="w-2/5 flex gap-2 items-center justify-evenly"
                                >
                                    <img
                                        className="rounded-xl max-h-20 max-w-20 w-1/2"
                                        src={match.away.logoPath}
                                        alt="away team logo"
                                    />
                                    <h2 className="text-light-text dark:text-dark-text text-xl w-1/2">
                                        {match.away.name}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div className="flex gap-4 justify-center items-center my-8">
                {page > 1 && (
                    <button
                        className="p-2 rounded-xl bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text w-fit hover:bg-light-primary dark:hover:bg-dark-primary hover:text-light-text dark:hover:text-dark-text"
                        onClick={() => setPage((prevPage) => prevPage - 1)}
                    >
                        Previous
                    </button>
                )}
                {count / limit > page && (
                    <button
                        className="p-2 rounded-xl bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text w-fit hover:bg-light-primary dark:hover:bg-dark-primary hover:text-light-text dark:hover:text-dark-text"
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}