/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                light: {
                    background: '#F0F4F8',
                    text: '#2C3E50',
                    primary: '#5B2C6F',
                    secondary: '#2874A6',
                    accent: '#5499C7',
                    neutral: '#D6DBDF'
                },
                dark: {
                    background: '#1C2833',
                    text: '#D5D8DC',
                    primary: '#5B2C6F',
                    secondary: '#2E86C1',
                    accent: '#5DADE2',
                    neutral: '#566573'
                }
            }
        }
    },

    plugins: []
}