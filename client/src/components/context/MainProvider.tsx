import AuthProvider from "features/auth/AuthProvider"
import React, { ReactNode } from "react"
import SocketProvider from "utils/socket/SocketProvider"

const MainProvider = ({ children }: { children: ReactNode }) => {
	return (
		<AuthProvider>
			<SocketProvider>{children}</SocketProvider>
		</AuthProvider>
	)
}

export default MainProvider
