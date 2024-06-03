import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.API_URL': JSON.stringify('http://localhost:3000')
    },
    server: {
        host: true
    }
})