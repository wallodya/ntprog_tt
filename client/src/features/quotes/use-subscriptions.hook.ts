import Decimal from "decimal.js"
import { Quote } from "models/Base"
import { useState } from "react"
import { useSocket } from "utils/socket/SocketProvider"



export const useMarketSubscription = (subscriptionId: string) => {
    const socket = useSocket()

    const [quotes, setQuotes] = useState<Quote[]>([{
        timestamp: Date.now(),
        bid: new Decimal(9.987),
        offer: new Decimal(10.005),
        bidAmount: new Decimal(300),
        offerAmount: new Decimal(570)
    }])

    socket.marketSubscriptionObserver.subscribe({
		id: subscriptionId,
		sub: setQuotes,
	})

    const latestQuote = quotes[0]

    const unsubscribe = () => {
        socket.unsubscribeMarketData(subscriptionId)
    }

    return {
        latestQuote,
        quotes,
        unsubscribe
    }
}