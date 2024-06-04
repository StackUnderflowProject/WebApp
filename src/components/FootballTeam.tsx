import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../stylesheets/team.css'
import { Season } from '../types/SeasonType.ts'
import { IMatch } from '../interfaces/IMatch.ts'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'
import { IStanding } from '../interfaces/IStanding.ts'
import { useTranslation } from 'react-i18next'

const fetchTeam = async (teamId?: string) => {
    if (!teamId) return
    const response = await fetch(`${import.meta.env.API_URL}/footballTeam/${teamId}`)
    const data = await response.json()
    if (response.ok) {
        return data
    } else {
        console.error('Failed to fetch football team')
    }
}

const fetchStadium = async (teamId?: string) => {
    if (!teamId) return
    const response = await fetch(`${import.meta.env.API_URL}/footballStadium/getByTeam/${teamId}`)
    const data = await response.json()
    if (response.ok) {
        return data.imageUrl
    } else {
        console.error('Failed to fetch football stadium')
    }
}

const fetchStandings = async (season: Season) => {
    const response = await fetch(`${import.meta.env.API_URL}/footballStanding/filterBySeason/${season}`)
    const data = await response.json()
    if (response.ok) {
        return data
    } else {
        console.error('Failed to fetch football standings')
    }
}

const fetchMatches = async (season: Season, teamId?: string) => {
    if (!teamId) return
    const response = await fetch(`${import.meta.env.API_URL}/footballMatch/filterBySeasonAndTeam/${season}/${teamId}`)
    const data = await response.json()
    if (response.ok) {
        return data.sort((a: IMatch, b: IMatch) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
    } else {
        console.error('Failed to fetch football matches')
    }
}

export function FootballTeam() {
    const navigate = useNavigate()
    const { teamId, season } = useParams()
    const { t } = useTranslation()

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

    useEffect(() => {
        localStorage.setItem('lastPath', '/footballTeam/' + teamId)
    }, [teamId])

    const {
        data: team,
        error: teamError,
        isLoading: teamLoading,
        isSuccess: teamSuccess
    } = useQuery({
        queryKey: ['footballTeam', teamId],
        queryFn: () => fetchTeam(teamId)
    })

    const {
        data: stadiumPicture,
        error: stadiumError,
        isLoading: stadiumLoading,
        isSuccess: stadiumSuccess
    } = useQuery({
        queryKey: ['stadium', teamId],
        queryFn: () => fetchStadium(teamId)
    })

    const {
        data: standings,
        error: standingsError,
        isLoading: standingsLoading,
        isSuccess: standingsSuccess
    } = useQuery({
        queryKey: ['standings', parseInt(season || '2024')],
        queryFn: () => fetchStandings(parseInt(season || '2024') as Season)
    })

    const {
        data: matches,
        error: matchesError,
        isLoading: matchesLoading,
        isSuccess: matchesSuccess
    } = useQuery({
        queryKey: ['matches', teamId, parseInt(season || '2024')],
        queryFn: () => fetchMatches(parseInt(season || '2024') as Season, teamId)
    })

    if (teamError) {
        return <div>Error: {teamError.message}</div>
    }

    if (stadiumError) {
        return <div>Error: {stadiumError.message}</div>
    }

    if (standingsError) {
        return <div>Error: {standingsError.message}</div>
    }

    if (matchesError) {
        return <div>Error: {matchesError.message}</div>
    }

    // LOADING SCREEN
    if (teamLoading || stadiumLoading || standingsLoading || matchesLoading) {
        return <Loading />
    }

    if (!teamSuccess) {
        return <div>Failed to load team</div>
    }

    if (!stadiumSuccess) {
        return <div>Failed to load stadium</div>
    }

    if (!standingsSuccess) {
        return <div>Failed to load standings</div>
    }

    if (!matchesSuccess) {
        return <div>Failed to load matches</div>
    }

    return (
        <div className="mb-8">
            <div className="cover-photo">
                <img src={stadiumPicture} alt="Stadium" className="stadium-photo" />
                <div className="profile-details">
                    <img src={team.logoPath} alt={`${team.name} logo`} className="team-logo" />
                    <h1 className="team-name">{team.name}</h1>
                </div>
            </div>
            <div className="team-info bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text">
                <p className="bg-light-background dark:bg-dark-background">
                    <strong>
                        {standings.find((standing: IStanding) => standing.team.name === team.name)?.place}. {t('place')}
                    </strong>
                </p>
                <p className="text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background">
                    <strong>{t('president')}:</strong> {team.president}
                </p>
                <p className="text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background">
                    <strong>{t('director')}:</strong> {team.director}
                </p>
                <p className="text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background">
                    <strong>{t('coach')}:</strong> {team.coach}
                </p>
            </div>
            <div className="stat-container w-full">
                <div className="standings">
                    <table className="w-full h-full table bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl">
                        <thead className="bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-text table-row-group rounded-xl">
                            <tr className="rounded-xl">
                                <th className="p-4 rounded-tl-xl border-r">
                                    {windowSize.width > 1600
                                        ? `${t('standings_page.place')}`
                                        : t('standings_page.place_short')}
                                </th>
                                <th className="border-r">{t('standings_page.team')}</th>
                                <th className="border-r px-2">
                                    {windowSize.width > 1600
                                        ? t('standings_page.games_played')
                                        : t('standings_page.games_played_short')}
                                </th>
                                <th className="border-r px-2">
                                    {windowSize.width > 1600
                                        ? t('standings_page.wins')
                                        : t('standings_page.wins_short')}
                                </th>
                                <th className="border-r px-2">
                                    {windowSize.width > 1600
                                        ? t('standings_page.draws')
                                        : t('standings_page.draws_short')}
                                </th>
                                <th className="border-r px-2">
                                    {windowSize.width > 1600
                                        ? t('standings_page.losses')
                                        : t('standings_page.losses_short')}
                                </th>
                                <th className="border-r px-2">
                                    {windowSize.width > 1600
                                        ? t('standings_page.goals')
                                        : t('standings_page.goals_short')}
                                </th>
                                <th className="rounded-tr-xl px-2">
                                    {windowSize.width > 1600
                                        ? t('standings_page.points')
                                        : t('standings_page.points_short')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-row-group">
                            {standings.map((standing: IStanding) => (
                                <tr
                                    key={standing._id}
                                    className={`border-t ${standing.team.name === team.name && 'bg-light-accent dark:bg-dark-accent text-light-background dark:text-dark-background'}`}
                                >
                                    <td className="border-r text-xl">{standing.place}.</td>
                                    <td className="border-r text-xl flex justify-center items-center gap-2 p-4 flex-wrap">
                                        <img
                                            src={standing.team.logoPath}
                                            alt={standing.team.name}
                                            className="h-16 w-16 mx-auto rounded-xl min-w-fit"
                                        />
                                        <span className="w-1/2 min-w-fit">{standing.team.name}</span>
                                    </td>
                                    <td className="border-r text-xl">{standing.gamesPlayed}</td>
                                    <td className="border-r text-xl">{standing.wins}</td>
                                    <td className="border-r text-xl">{standing.draws}</td>
                                    <td className="border-r text-xl">{standing.losses}</td>
                                    <td className="border-r text-xl">
                                        {standing.goalsScored}:{standing.goalsConceded}
                                    </td>
                                    <td className="text-xl">{standing.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="matches-container">
                    <table className="matches-table bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-xl ">
                        <tbody>
                            {matches.map((match: IMatch) => (
                                <tr
                                    id={match.score === '' ? 'toBePlayed' : undefined}
                                    key={match._id}
                                    className="match-row text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background"
                                >
                                    <td className="home-name">{match.home.name}</td>
                                    <td>
                                        <div className="center-wrapper-small">
                                            <div
                                                onClick={() =>
                                                    navigate(`/footballTeam/${match.home._id}/${match.season}`)
                                                }
                                                className="home-team-small"
                                            >
                                                <img
                                                    id="team-logo-small"
                                                    src={match.home.logoPath}
                                                    alt="home team logo"
                                                />
                                            </div>
                                            <p id="score-small">{match.score === '' ? '- : -' : match.score}</p>
                                            <div
                                                onClick={() =>
                                                    navigate(`/footballTeam/${match.away._id}/${match.season}`)
                                                }
                                                className="away-team-small"
                                            >
                                                <img
                                                    id="team-logo-small"
                                                    src={match.away.logoPath}
                                                    alt="away team logo"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="away-name">{match.away.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}