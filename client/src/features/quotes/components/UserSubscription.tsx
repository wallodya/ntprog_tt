import Button from "components/ui/Button"
import { MarketSubscription } from "models/Base"
import SubscriptionQuotes from "./SubscriptionQuotes"

const UserSubcriptions = ({
	subscriptions,
}: {
	subscriptions: MarketSubscription[]
}) => {
	return (
		<>
			<div className="mb-8 w-full flex justify-between items-baseline">
				<h2 className="font-bold text-2xl">Subscriptions</h2>
				<Button type="primary">New subscription</Button>
			</div>
			<div className="flex gap-4">
				{subscriptions.map(subscription => (
					<SubscriptionQuotes
						subscription={subscription}
						key={subscription.subscriptionId}
					/>
				))}
			</div>
		</>
	)
}

export default UserSubcriptions
