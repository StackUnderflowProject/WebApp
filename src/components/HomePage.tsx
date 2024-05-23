import { ChangeEvent, useState } from 'react'
import { MatchesMap } from './MatchesMap.tsx'
import { Sport } from '../types/SportType.ts'
import { StadiumMap } from './StadiumMap.tsx'

type Option = 'stadiums' | 'matches'

const lastWeek = () => {
    const today = new Date()
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
    return lastWeek.toISOString().split('T')[0]
}

export const HomePage = () => {
    const [selectedOption, setSelectedOption] = useState<Option>('stadiums')
    const [season, setSeason] = useState<number>(2024)
    const [sport, setSport] = useState<Sport>('football')
    const [fromDate, setFromDate] = useState<string>(lastWeek())
    const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0])

    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as Option)
    }

    const handleSeasonChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSeason(parseInt(e.target.value, 10))
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

    return (
        <main className="flex flex-row justify-center gap-8 mt-2 p-4 h-[90%] w-full">
            <aside className="bg-blue-300 w-1/5 p-8 rounded-xl text-left">
                <h1 className="text-2xl text-black">What?</h1>
                <select
                    className="bg-black text-2xl p-4 rounded-xl"
                    value={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value={'stadiums'}>Stadiums</option>
                    <option value={'matches'}>Matches</option>
                </select>
                <div className="flex flex-col justify-center items-left gap-4 text-2xl mt-4 w-full">
                    <h1>{selectedOption === 'stadiums' ? 'Stadium' : 'Match'} Options</h1>
                    <select
                        value={sport}
                        onChange={handleSportChange}
                        className="pl-4 pr-4 pt-2 pb-2 rounded-xl bg-black"
                    >
                        <option value="football">Football</option>
                        <option value="handball">Handball</option>
                    </select>
                    {selectedOption === 'stadiums' && (
                        <select
                            value={season}
                            onChange={handleSeasonChange}
                            className="pl-4 pr-4 pt-2 pb-2 rounded-xl bg-black"
                        >
                            <option value={2020}>2020</option>
                            <option value={2021}>2021</option>
                            <option value={2022}>2022</option>
                            <option value={2023}>2023</option>
                            <option value={2024}>2024</option>
                        </select>
                    )}
                </div>
                {selectedOption === 'matches' && (
                    <div className="mt-4 flex flex-col gap-4">
                        <input
                            type="date"
                            className="text-black text-xl p-4 rounded-xl"
                            value={fromDate}
                            onChange={handleFromDateChange}
                        />
                        <input
                            type="date"
                            className="text-black text-xl p-4 rounded-xl"
                            value={toDate}
                            onChange={handleToDateChange}
                        />
                    </div>
                )}
            </aside>
            <section className="w-4/5 h-full">
                {selectedOption === 'stadiums' ? (
                    <StadiumMap season={season} sport={sport} />
                ) : (
                    <MatchesMap sport={sport} fromDate={new Date(fromDate)} toDate={new Date(toDate)} />
                )}
            </section>
        </main>
    )
}