import { MarketSubscription } from "models/Base"
import { useEffect, useState } from "react"

const fetchSubscritions = async () => {

}

export const useSubscriptions = () => {
	const [subscriptions, setSubscriptions] = useState<MarketSubscription[]>([])
    
    
    const removeSubscription = (id: number) => {
        setSubscriptions(subs => subs.filter(s => s.subscriptionId !== id))
	}

	const addSubscription = (sub: MarketSubscription) => {
        setSubscriptions(subs => [...subs, sub])
	}

    const clearSubscriptions = () => {
        setSubscriptions([])
    }

    return {
        subscriptions,
        addSubscription,
        removeSubscription,
        clearSubscriptions,
        setSubscriptions
    }
}

export const useUserInit = () => {
    useEffect(() => {}, [])
}