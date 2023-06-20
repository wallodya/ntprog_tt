import React, { ReactNode, createContext, useContext, useEffect } from "react"
import WSConnector from "./WSClient"

type SocketContextValue = WSConnector

const initialContext = new WSConnector()

const SocketContext = createContext<SocketContextValue>(initialContext)

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }: { children: ReactNode }) => {
	const socket = new WSConnector()

    // useEffect(() => {
    //     socket.connect()
    //     return () => socket.disconnect()
    // }, [])


	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}

export default SocketProvider
