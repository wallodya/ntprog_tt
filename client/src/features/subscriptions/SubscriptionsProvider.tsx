import { MarketDataUpdate } from "models/ServerMessages"
import { ReactNode, createContext, useContext } from "react"
import { useMarketUpdate, useSavedSubscriptions } from "./subscriptions.hooks"

type SubscriptionsContextValue = {
    subscriptions: MarketDataUpdate[],
    updateSubscription: (sub: MarketDataUpdate) => void,
    unsubscribe: (subId: number) => void,
    subscribe: (intrumentId: number) => void,
    clearSubscriptions: () => void,
    setSubscriptions: (sub: MarketDataUpdate[]) => void,
}

const initialContext: SubscriptionsContextValue = {
    subscriptions: [],
    updateSubscription: (sub: MarketDataUpdate) => {},
    unsubscribe: (subId: number) => {},
    subscribe: (instrumentId: number) => {},
    clearSubscriptions: () => {},
    setSubscriptions: (sub: MarketDataUpdate[]) => {},
}

const SubscriptionsContext = createContext(initialContext)

export const useSubscriptions = () => useContext(SubscriptionsContext)

const SubscriptionsProvider = ({ children }: { children: ReactNode }) => {

    const subscriptionsControls = useSavedSubscriptions()

    useMarketUpdate(subscriptionsControls.updateSubscription)

	return (
		<SubscriptionsContext.Provider value={subscriptionsControls}>
			{children}
		</SubscriptionsContext.Provider>
	)
}

export default SubscriptionsProvider
