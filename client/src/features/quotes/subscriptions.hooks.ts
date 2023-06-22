import Decimal from "decimal.js"
import { useAuth } from "features/auth/AuthProvider"
import { MarketSubscription, Quote } from "models/Base"
import { MarketDataUpdate } from "models/ServerMessages"
import { useEffect, useState } from "react"
import { useSocket } from "utils/socket/SocketProvider"
import { deleteSubscriptions, getSavedSubscriptions, saveSubscriptions } from "./subscriptions.utils"

export const useSavedSubscriptions = () => {
	const [subscriptions, setSubscriptions] = useState<MarketSubscription[]>(getSavedSubscriptions)

	const removeSubscription = (id: number) => {
		setSubscriptions(s => s.filter(sub => sub.subscriptionId !== id))
		saveSubscriptions(getSavedSubscriptions().filter(sub => sub.subscriptionId !== id))
	}

	const addSubscription = (sub: MarketSubscription) => {
		saveSubscriptions([...getSavedSubscriptions(), sub])
		setSubscriptions(s => getSavedSubscriptions())
        console.debug("Added new subscription: ", sub, getSavedSubscriptions())
	}

    const setAllSubscriptions = (subs: MarketSubscription[]) => {
        setSubscriptions(s => subs)
        saveSubscriptions(subs)
    }

	const clearSubscriptions = () => {
		setSubscriptions(s => [])
		deleteSubscriptions()
	}

	return {
		subscriptions,
		addSubscription,
		removeSubscription,
		clearSubscriptions,
		setSubscriptions: setAllSubscriptions,
	}
}

export const useNewScubscription = () => {
    const socket = useSocket()
    const { controls: { addSubscription } } = useAuth()

    const onNewSubscription = (data: MarketDataUpdate) => {

        const savedSubscriptions = getSavedSubscriptions()

        if (!savedSubscriptions) {
            addSubscription({
                instrument: data.instrument,
                subscriptionId: data.subscriptionId
            })
            return
        }

        const existingSubscription = savedSubscriptions.find(
			sub => sub.subscriptionId === data.subscriptionId
		)
        
        if (!existingSubscription) {
            addSubscription({
                instrument: data.instrument,
                subscriptionId: data.subscriptionId
            })
            socket.emit("market-update", data)
        }
    }

    useEffect(() => {
        const eventName = "market-update"
        socket.on(eventName, onNewSubscription)
        return () => {
            socket.removeListener(eventName, onNewSubscription)
        }
    },[socket])
}

export const useMarketSubscription = (subscriptionId: number) => {
	const socket = useSocket()
	const userData = useAuth()

	const nullQuote: Quote = {
		timestamp: Date.now(),
		bid: new Decimal(0),
		offer: new Decimal(0),
		bidAmount: new Decimal(0),
		offerAmount: new Decimal(0),
	}

	const [quotes, setQuotes] = useState<Quote[]>([])
	const [latestQuote, setLatestQuote] = useState<Quote>(nullQuote)

	const onMarketUpdate = (data: MarketDataUpdate) => {
		if (data.subscriptionId !== subscriptionId) {
			return
		}
		console.debug("Market quotes updated")
		setQuotes(data.quotes)
		setLatestQuote(data.quotes[0] ?? nullQuote)
	}
	useEffect(() => {
		const eventName = "market-update"

		socket.on(eventName, onMarketUpdate)
		return () => {
			socket.removeListener(eventName, onMarketUpdate)
		}
	}, [])

	const unsubscribe = () => {
		if (!userData.user) {
			return
		}
		socket.unsubscribeMarketData(subscriptionId)
		userData.controls.removeSubscription(subscriptionId)
	}

	return {
		latestQuote,
		quotes,
		unsubscribe,
	}
}
