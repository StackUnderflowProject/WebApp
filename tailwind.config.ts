/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                light: {
                    background: '#e5e5e8',
                    text: '#040404',
                    primary: '#be89ec',
                    secondary: '#a84fff',
                    accent: '#F59E0B',
                    neutral: '#9CA3AF'
                },
                dark: {
                    primary: '#6D28D9',
                    text: '#F3F4F6',
                    background: '#111827',
                    secondary: 'rgba(142,60,178,0.73)',
                    accent: '#FBBF24',
                    neutral: '#D1D5DB'
                }
            }
        }
    },

    plugins: []
}