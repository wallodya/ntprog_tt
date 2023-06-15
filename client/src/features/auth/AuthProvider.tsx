import { MarketSubscription } from "models/Base"
import { ReactNode, createContext, useContext } from "react"

export type AuthContextValue =
	| {
			subscriptions: MarketSubscription[]
			user: {
				login: string,
                uuid: string
			}
	  }
	| {
			user: null
	  }

const initialContext: AuthContextValue = {
	user: null,
}

const AuthContext = createContext<AuthContextValue>(initialContext)

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const contextValue: AuthContextValue = {
		user: {
			login: "User1",
            uuid: "user-1-id"
		},
		subscriptions: [
			{
				subscriptionId: "some-id-1",
				instrument: {
					instrumentId: 1,
					name: "USD/RUB",
				},
			},
			{
				subscriptionId: "some-id-2",
				instrument: {
					instrumentId: 2,
					name: "EUR/USD",
				},
			},
			{
				subscriptionId: "some-id-3",
				instrument: {
					instrumentId: 3,
					name: "EUR/RUB",
				},
			},
		],
	}

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
