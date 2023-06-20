import Decimal from "decimal.js"
import { useAuth } from "features/auth/AuthProvider"
import { Quote } from "models/Base"
import { useEffect, useState } from "react"
import { useSocket } from "utils/socket/SocketProvider"

const MOCK_QUOTES: Quote[] = [
	{
		timestamp: Date.now(),
		bid: new Decimal(9.987),
		offer: new Decimal(10.005),
		bidAmount: new Decimal(300),
		offerAmount: new Decimal(570),
	},
	{
		timestamp: Date.now(),
		bid: new Decimal(9.987),
		offer: new Decimal(10.005),
		bidAmount: new Decimal(300),
		offerAmount: new Decimal(570),
	},
	{
		timestamp: Date.now(),
		bid: new Decimal(9.987),
		offer: new Decimal(10.005),
		bidAmount: new Decimal(300),
		offerAmount: new Decimal(570),
	},
]

export const useMarketSubscription = (subscriptionId: number) => {
    const socket = useSocket()
    const userData = useAuth()

    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES)

    const onMarketUpdate = (quotes: Quote[]) => {
        setQuotes(quotes)
    }
    useEffect(() => {
        const eventName = `market-update-${subscriptionId}`
        socket.on(eventName, onMarketUpdate)
        return () => {socket.removeListener(eventName, onMarketUpdate)}
    }, [])

    const latestQuote = quotes[0]

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
        unsubscribe
    }
}