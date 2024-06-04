// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface WebSocketContextProps {
    socket: Socket | null
}

const WebSocketContext = createContext<WebSocketContextProps>({ socket: null })

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const newSocket = io(import.meta.env.SOCKET_URL, {})
        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])

    return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>
}