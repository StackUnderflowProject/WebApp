import { useEffect, useState } from 'react'
import { IFootballTeam } from '../interfaces/IFootballTeam.ts'
import { Sport } from '../types/SportType.ts'
import { TeamStatsGraph } from './TeamStatsGraph.tsx'
import { Loading } from './Loading.tsx'
import { useQuery } from '@tanstack/react-query'
import { IHandballTeam } from '../interfaces/IHandballTeam.ts'

const fetchTeamNames = async (sport: Sport) => {
    const response = await fetch(`${import.meta.env.API_URL}/${sport}Team`)
    if (!response.ok) {
        throw new Error('Failed to fetch team names')
    }
    return await response.json()
}

export const TeamsStats = () => {
    const [selectedSport, setSelectedSport] = useState<Sport>('football')
    const [selectedTeam, setSelectedTeam] = useState<string>('')

    const {
        data: footballTeams,
        error: footballError,
        isLoading: isFootballLoading,
        isSuccess: isFootballSuccess
    } = useQuery<IFootballTeam[]>({
        queryKey: ['footballTeamNames'],
        queryFn: () => fetchTeamNames('football')
    })

    const {
        data: handballTeams,
        error: handballError,
        isLoading: isHandballLoading,
        isSuccess: isHandballSuccess
    } = useQuery<IHandballTeam[]>({
        queryKey: ['handballTeamNames'],
        queryFn: () => fetchTeamNames('handball')
    })

    useEffect(() => {
        setSelectedTeam('')
    }, [selectedSport])

    if (footballError && selectedSport == 'football') return <h2>Error: {footballError.message}</h2>
    if (handballError && selectedSport == 'handball') return <h2>Error: {handballError.message}</h2>

    if (isFootballLoading && selectedSport == 'football') return <Loading />
    if (isHandballLoading && selectedSport == 'handball') return <Loading />

    if (!isFootballSuccess) return <h2>No football data available</h2>
    if (!isHandballSuccess) return <h2>No handball data available</h2>

    const footballTeamNames = new Set<string>(footballTeams.map((team) => team.name))
    const handballTeamNames = new Set<string>(handballTeams.map((team) => team.name))

    return (
        <div className="text-center p-4 m-4 bg-amber-600 rounded-xl">
            <h1 className="mb-4">Team Stats</h1>
            <div className="m-4 flex gap-8 text-2xl">
                <h2>Choose a sport:</h2>
                <select
                    title="Sport"
                    value={selectedSport}
                    onChange={(event) => setSelectedSport(event.target.value as Sport)}
                    className="pl-4 pr-4 pt-2 pb-2 rounded-xl"
                >
                    <option value="football">Football</option>
                    <option value="handball">Handball</option>
                </select>
            </div>
            {selectedSport === 'football' && (
                <div className="m-4 flex gap-8 text-2xl">
                    <h2>Football</h2>
                    <select
                        title="Football teams"
                        value={selectedTeam}
                        onChange={(event) => setSelectedTeam(event.target.value)}
                        className="pl-4 pr-4 pt-2 pb-2 rounded-xl"
                    >
                        <option></option>
                        {[...footballTeamNames].map((teamName, index) => (
                            <option key={index} value={teamName}>
                                {teamName}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectedSport === 'handball' && (
                <div className="m-4 flex gap-8 text-2xl">
                    <h2>Handball</h2>
                    <select
                        title="Handball teams"
                        value={selectedTeam}
                        onChange={(event) => setSelectedTeam(event.target.value)}
                    >
                        <option></option>
                        {[...handballTeamNames].map((teamName, index) => (
                            <option key={index} value={teamName}>
                                {teamName}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectedTeam.length > 0 && <TeamStatsGraph name={selectedTeam} sport={selectedSport} />}
        </div>
    )
}