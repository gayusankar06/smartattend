import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinSession: (sessionCode: string) => void
  leaveSession: (sessionCode: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;
    
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000'
    
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
    })

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    setSocket(socketInstance)
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const joinSession = (sessionCode: string) => {
    if (socket && isConnected) {
      socket.emit('joinSession', sessionCode)
    }
  }

  const leaveSession = (sessionCode: string) => {
    if (socket && isConnected) {
      socket.emit('leaveSession', sessionCode)
    }
  }

  const value = {
    socket,
    isConnected,
    joinSession,
    leaveSession
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}