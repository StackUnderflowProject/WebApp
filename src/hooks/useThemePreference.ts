import { useEffect, useState } from 'react'

export const useThemePreference = () => {
    const getCurrentTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const [theme, setTheme] = useState(getCurrentTheme)

    useEffect(() => {
        const handleChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return theme
}