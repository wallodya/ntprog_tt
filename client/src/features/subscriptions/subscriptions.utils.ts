import { MarketSubscription } from "models/Base";
import { MarketDataUpdate } from "models/ServerMessages";
import { subscriptionArraySchema } from "utils/validation/schemas/schemas";

const SUBSCRIPTIONS_LS_NAME ="subscriptions"

export const MARKET_UPDATE_EVENT_NAME = "market-update"


export const saveSubscriptions = (subscription: MarketSubscription[]) => {
	localStorage.setItem(SUBSCRIPTIONS_LS_NAME, JSON.stringify(subscription))
}   

export const getSavedSubscriptions = (): MarketDataUpdate[] => {
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