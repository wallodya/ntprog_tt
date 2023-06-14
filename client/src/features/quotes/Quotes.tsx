import Card from "components/ui/Card"
import { MarketSubscription } from "models/Base"

import Button from "components/ui/Button"
import SubscriptionQuotes from "./SubscriptionQuotes"

const MOCK_SUBS: MarketSubscription[] = [
	{
		subscriptionId: "some-id-1",
		instrument: {
			instrumentId: 1,
			name: "USD/RUB",
		},
	},
	{
		subscriptionId: "some-id-2",
		instrument: {
			instrumentId: 2,
			name: "EUR/USD",
		},
	},
	{
		subscriptionId: "some-id-3",
		instrument: {
			instrumentId: 3,
			name: "EUR/RUB",
		},
	},
]

const Quotes = () => {
	return (
		<Card>
			<div className="mb-8 w-full flex justify-between items-baseline">
				<h2 className="font-bold text-2xl">Subscriptions</h2>
				<Button type="primary">New subscription</Button>
			</div>
			<div className="flex gap-4">
				{MOCK_SUBS.map(subscription => (
					<SubscriptionQuotes
						subscription={subscription}
						key={subscription.subscriptionId}
					/>
				))}
			</div>
		</Card>
	)
}

export default Quotes
