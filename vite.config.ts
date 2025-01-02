import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // 'import.meta.env.API_URL': JSON.stringify('http://20.56.20.111:3000'),
        // 'import.meta.env.API_URL': JSON.stringify('http://localhost:3000'),
        'import.meta.env.API_URL': JSON.stringify('http://77.38.76.152:3000'),

        // 'import.meta.env.SOCKET_URL': JSON.stringify('http://20.56.20.111:3001'),
        // 'import.meta.env.SOCKET_URL': JSON.stringify('http://localhost:3001'),
        'import.meta.env.SOCKET_URL': JSON.stringify('http://77.38.76.152:3001'),

        // 'import.meta.env.PREDICT_URL': JSON.stringify('http://127.0.0.1:5000')
        'import.meta.env.PREDICT_URL': JSON.stringify('http://77.38.76.152:5000')
    },
    server: {
        host: true
    }
})
