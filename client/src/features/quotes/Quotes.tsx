import Card from "components/ui/Card"

import { useAuth } from "features/auth/AuthProvider"
import UserSubcriptions from "./components/UserSubscriptions"
import { useNewScubscription } from "./subscriptions.hooks"
import { MarketSubscription } from "models/Base"
import { useEffect, useState } from "react"

const SignInPrompt = () => {
	return (
		<div>
			<h2 className="text-xl font-bold">Sign in to recieve latest quotes updates</h2>
		</div>
	)
}

const Quotes = () => {
	const userData = useAuth()

    const [displayedSubscriptions, setDisplayedSubscriptions] = useState<MarketSubscription[]>(userData.subscriptions)

    useEffect(() => {
        setDisplayedSubscriptions(userData.subscriptions)
    }, [userData.subscriptions, userData.subscriptions.length])

    useNewScubscription()

	return (
		<Card>
			{userData.user ? (
                <UserSubcriptions subscriptions={displayedSubscriptions} />
			) : (
				<SignInPrompt />
			)}
		</Card>
	)
}

export default Quotes
