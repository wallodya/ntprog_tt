import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AuthProvider from "features/auth/AuthProvider"
import InstrumentsProvider from "features/instruments/InstrumentsProvider"
import SubscriptionsProvider from "features/subscriptions/SubscriptionsProvider"
import React, { ReactNode } from "react"
import SocketProvider from "utils/socket/SocketProvider"

const queryClient = new QueryClient()

const MainProvider = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<SocketProvider>
					<SubscriptionsProvider>
						<InstrumentsProvider>{children}</InstrumentsProvider>
					</SubscriptionsProvider>
				</SocketProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default MainProvider
