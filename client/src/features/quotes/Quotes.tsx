import Card from "components/ui/Card"
import { MarketSubscription } from "models/Base"

import { useAuth } from "features/auth/AuthProvider"
import UserSubcriptions from "./components/UserSubscriptions"

const SignInPrompt = () => {
	return (
		<div>
			<h2 className="text-xl font-bold">Sign in to recieve latest quotes updates</h2>
		</div>
	)
}

const Quotes = () => {
	const userData = useAuth()

	return (
		<Card>
			{userData.user ? (
                <UserSubcriptions subscriptions={userData.subscriptions} />
			) : (
				<SignInPrompt />
			)}
		</Card>
	)
}

export default Quotes
