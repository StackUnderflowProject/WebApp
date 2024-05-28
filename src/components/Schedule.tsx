import { useState, useEffect, useRef } from 'react'
import '../stylesheets/schedule.css'
import { useNavigate } from 'react-router-dom'
import { IMatch } from '../interfaces/IMatch.ts'
import { Sport } from '../types/SportType.ts'
import { Season } from '../types/SeasonType.ts'
import { useQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const fetchMatches = async (sport: Sport, season: Season) => {
    const response = await fetch(`http://localhost:3000/${sport}Match/filterBySeason/${season}`)
    if (!response.ok) {
        throw new Error('Error fetching data')
    }
    return response.json()
}

export const Schedule = () => {
    const navigate = useNavigate()
    const [sport, setSport] = useState(() => {
        const storedSport = localStorage.getItem('scheduleSportS')
        return storedSport ? (storedSport as Sport) : ('football' as Sport)
    })
    const [season, setSeason] = useState<Season>(() => {
        const storedSeason = localStorage.getItem('scheduleSeasonS')
        return storedSeason ? (parseInt(storedSeason) as Season) : (2024 as Season)
    })

    const {
        data: matches,
        error,
        isLoading,
        isSuccess
    } = useQuery<IMatch[]>({
        queryKey: ['match', sport, season],
        queryFn: () => fetchMatches(sport, season)
    })

    const myRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        localStorage.setItem('scheduleSportS', sport)
        localStorage.setItem('scheduleSeasonS', season.toString())
    }, [sport, season])

    const [showScrollButton, setShowScrollButton] = useState(false)
    const defaultScrollPositionRef = useRef(0)

    // SCROLLS TO TODAY MATCHES
    useEffect(() => {
        if (myRef.current) {
            const rect = myRef.current.getBoundingClientRect()
            const scrollOffset = rect.top + window.scrollY - window.innerHeight / 4
            window.scrollTo({ top: scrollOffset, behavior: 'instant' })
            defaultScrollPositionRef.current = scrollOffset
        }
    }, [matches])

    // BUTTON CLICK TO SCROLL TO DEFAULT
    const scrollToToday = () => {
        window.scrollTo({ top: defaultScrollPositionRef.current, behavior: 'smooth' })
    }

    // GET SCROLL y POSTION
    const handleScroll = () => {
        const position = window.scrollY
        setShowScrollButton(Math.abs(defaultScrollPositionRef.current - position) > 400) // Show button when scrolled down by 400px
    }

    useEffect(() => {
        localStorage.setItem("lastPath", "/schedule");
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // CHANGE DATE FORMAT
    const formatDateString = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        let dayOfWeek = new Intl.DateTimeFormat('sl-SI', { weekday: 'long' }).format(date)

        if (date.toDateString() === today.toDateString()) {
            dayOfWeek = 'Today'
        } else if (date.toDateString() === yesterday.toDateString()) {
            dayOfWeek = 'Yesterday'
        } else if (date.toDateString() === tomorrow.toDateString()) {
            dayOfWeek = 'Tomorrow'
        }

        const day = new Intl.DateTimeFormat('sl-SI', { day: 'numeric' }).format(date)
        const month = new Intl.DateTimeFormat('sl-SI', { month: 'long' }).format(date)
        return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} - ${day} ${month} ${date.getFullYear()}`
    }

    // CHANGE SPORT FILTER
    const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSport = event.target.value as Sport
        setSport(selectedSport)
    }

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSeason = parseInt(event.target.value) as Season
        setSeason(selectedSeason)
    }

    if (error) {
        return <div>Error fetching data</div>
    }

    // LOADING SCREEN
    if (isLoading) {
        return <Loading />
    }

    if (!isSuccess) {
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
            {showScrollButton && (
                <button
                    onClick={scrollToToday}
                    className="fixed right-4 bottom-4 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text w-fit p-4 rounded-xl"
                >
                    <FontAwesomeIcon icon={['fas', 'chevron-up']} />
                </button>
            )}
            <div className="w-max absolute p-4 right-0 flex gap-2">
                <select
                    onChange={handleSportChange}
                    className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text rounded-xl p-2"
                    value={sport}
                >
                    <option value="football">Football</option>
                    <option value="handball">Handball</option>
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
            {Object.entries(matchesByDate)
                .reverse()
                .map(([date, dateMatches]) => (
                    <div
                        key={date}
                        className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl p-4 my-4 flex flex-col gap-4"
                    >
                        <div className="date-container">
                            <h2 className="text-light-text dark:text-dark-text">{formatDateString(date)}</h2>
                        </div>
                        {dateMatches.map((match) => {
                            return (
                                <div className="flex w-full">
                                    <div
                                        key={match._id}
                                        className="bg-light-primary dark:bg-dark-primary rounded-xl flex justify-evenly items-center p-4 w-full"
                                        id={match._id}
                                    >
                                        <div
                                            onClick={() => navigate(`/${sport}Team/${match.home._id}`)}
                                            className="w-2/5 flex flex-col gap-2 items-center justify-evenly"
                                        >
                                            <h2 className="text-light-text dark:text-dark-text text-xl">
                                                {match.home.name}
                                            </h2>
                                            <img
                                                className="rounded-xl max-h-24 max-w-24"
                                                src={match.home.logoPath}
                                                alt="home team logo"
                                            />
                                        </div>
                                        <h1 className="text-2xl p-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl w-1/5">
                                            {match.score === '' ? '- : -' : match.score}
                                        </h1>
                                        <div
                                            onClick={() => navigate(`/${sport}Team/${match.away._id}`)}
                                            className="w-2/5 flex flex-col gap-2 items-center justify-evenly"
                                        >
                                            <h2 className="text-light-text dark:text-dark-text text-xl">
                                                {match.away.name}
                                            </h2>
                                            <img
                                                className="rounded-xl max-h-24 max-w-24"
                                                src={match.away.logoPath}
                                                alt="away team logo"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
        </div>
    )
}