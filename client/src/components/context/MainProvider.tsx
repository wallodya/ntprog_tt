import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthProvider from "features/auth/AuthProvider"
import InstrumentsProvider from "features/instruments/InstrumentsProvider"
import React, { ReactNode } from "react"
import SocketProvider from "utils/socket/SocketProvider"

const queryClient = new QueryClient()

const MainProvider = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<InstrumentsProvider>
					<SocketProvider>{children}</SocketProvider>
				</InstrumentsProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default MainProvider
