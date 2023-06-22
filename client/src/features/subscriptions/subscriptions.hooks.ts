import { MarketDataUpdate } from "models/ServerMessages"
import { useEffect, useState } from "react"
import { useSocket } from "utils/socket/SocketProvider"
import { MARKET_UPDATE_EVENT_NAME, deleteSubscriptions, getSavedSubscriptions, saveSubscriptions } from "./subscriptions.utils"
import { useAuth } from "features/auth/AuthProvider"

export const useSavedSubscriptions = () => {
	// const [subscriptions, setSubscriptions] = useState<MarketDataUpdate[]>(getSavedSubscriptions)
	const [subscriptions, setSubscriptions] = useState<MarketDataUpdate[]>([])
    const socket = useSocket()
    const { user } = useAuth()

	const removeSubscription = (id: number) => {
		setSubscriptions(s => s.filter(sub => sub.subscriptionId !== id))
		// saveSubscriptions(getSavedSubscriptions().filter(sub => sub.subscriptionId !== id))
	}

    const unsubscribe = (subscriptionId: number) => {
		if (!user) {
			return
		}
		socket.unsubscribeMarketData(subscriptionId)
		removeSubscription(subscriptionId)
	}

    const subscribe = (instrumentId: number) => {
		if (!user) {
			return
		}
		socket.subscribeMarketData(instrumentId)
	}

	const addSubscription = (sub: MarketDataUpdate) => {
		setSubscriptions(s => [...s, sub])
		// saveSubscriptions([...subscriptions, sub])
        console.debug("Added new subscription: ", sub)
	}

    const setAllSubscriptions = (subs: MarketDataUpdate[]) => {
        setSubscriptions(s => subs)
        // saveSubscriptions(subs)
    }

    const updateSubscription = (data: MarketDataUpdate) => {
        let wasUpdated: boolean = false

        const updatedSubscriptions = subscriptions.map(sub => {
            if (sub.subscriptionId === data.subscriptionId) {
                wasUpdated = true
                console.debug("updated existing subscription")
                return data
            }
            return sub
        })

        if (wasUpdated) {
            setSubscriptions(updatedSubscriptions)
            // saveSubscriptions(updatedSubscriptions)
            return
        }

        addSubscription(data)
    }

	const clearSubscriptions = () => {
		setSubscriptions(s => [])
		// deleteSubscriptions()
	}

	return {
		subscriptions,
        updateSubscription,
        unsubscribe,
        subscribe,
		clearSubscriptions,
		setSubscriptions: setAllSubscriptions,
	}
}

export const useMarketUpdate = (
    updateSubscription: (sub: MarketDataUpdate) => void
) => {
    const socket = useSocket()

    const onMarketUpdate = (data: MarketDataUpdate) => {
        updateSubscription(data)
    }

    useEffect(() => {
        socket.on(MARKET_UPDATE_EVENT_NAME, onMarketUpdate)
        return () => {
            socket.removeListener(MARKET_UPDATE_EVENT_NAME, onMarketUpdate)
        }
    },[socket])
}
