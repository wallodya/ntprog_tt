import Card from "components/ui/Card"

import { useAuth } from "features/auth/AuthProvider"
import UserSubcriptions from "./components/UserTickers"

const SignInPrompt = () => {
	return (
		<div>
			<h2 className="text-xl font-bold">Sign in to recieve latest quotes updates</h2>
		</div>
	)
}

const Tickers = () => {
	const { user } = useAuth()

	return (
		<Card>
			{user ? (
                <UserSubcriptions/>
			) : (
				<SignInPrompt />
			)}
		</Card>
	)
}

export default Tickers
