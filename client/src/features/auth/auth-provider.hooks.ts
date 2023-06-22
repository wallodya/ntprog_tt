import { MarketSubscription } from "models/Base"
import { useEffect, useState } from "react"

export const useSubscriptions_xxxx = () => {
	const [subscriptions, setSubscriptions] = useState<MarketSubscription[]>([])
    
    
    const removeSubscription = (id: number) => {
        setSubscriptions(subs => subs.filter(s => s.subscriptionId !== id))
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions))
	}
    
	const addSubscription = (sub: MarketSubscription) => {
        setSubscriptions(subs => [...subs, sub])
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions))
	}
    
    const clearSubscriptions = () => {
        setSubscriptions([])
        localStorage.removeItem("subscriptions")
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