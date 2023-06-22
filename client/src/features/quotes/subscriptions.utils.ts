import { MarketSubscription } from "models/Base";
import { subscriptionArraySchema } from "utils/validation/schemas";

const SUBSCRIPTIONS_LS_NAME ="subscriptions"


export const saveSubscriptions = (subscription: MarketSubscription[]) => {
	localStorage.setItem(SUBSCRIPTIONS_LS_NAME, JSON.stringify(subscription))
}   

export const getSavedSubscriptions = (): MarketSubscription[] => {
    const data =  localStorage.getItem(SUBSCRIPTIONS_LS_NAME)

    if (!data) {
        return []
    }

    const rawData = JSON.parse(data)

    const parsed = subscriptionArraySchema.safeParse(rawData)

    if (!parsed.success) {
        return []
    }

    return parsed.data
}

export const deleteSubscriptions = () => {
    localStorage.removeItem(SUBSCRIPTIONS_LS_NAME)
}