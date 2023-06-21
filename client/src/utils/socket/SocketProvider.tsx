import React, { ReactNode, createContext, useContext, useEffect, useMemo } from "react"
import WSConnector from "./WSClient"
import { useAuth } from "features/auth/AuthProvider"

type SocketContextValue = WSConnector

const initialContext = new WSConnector()

const SocketContext = createContext<SocketContextValue>(initialContext)

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }: { children: ReactNode }) => {
	const socket = useMemo(() => new WSConnector(), []) 

    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            socket.connect()
        }

        return () => {
            if (socket.connection) {
                socket.disconnect()
            }
        }

    }, [user, socket])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}

export default SocketProvider
