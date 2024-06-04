import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.API_URL': JSON.stringify('http://20.56.20.111:3000'),
        // 'import.meta.env.API_URL': JSON.stringify('http://localhost:3000'),
        'import.meta.env.SOCKET_URL': JSON.stringify('http://20.56.20.111:3001')
        // 'import.meta.env.SOCKET_URL': JSON.stringify('http://localhost:3001')
    },
    server: {
        host: true
    }
})