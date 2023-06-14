import Button from "components/ui/Button"
import Card from "components/ui/Card"
import { Instrument, MarketSubscription } from "models/Base"

const PriceSell = () => {
	return (
		<div className="mb-2 flex justify-evenly items-baseline text-neutral-900">
			<p className="text-sm font-bold">8</p>
			<span className="text-xl font-bold">.55</span>
			<p className="text-sm font-bold">8</p>
		</div>
	)
}

const PriceBuy = () => {
	return (
		<div className="mb-2 flex justify-evenly items-baseline text-neutral-900">
			<p className="text-sm font-bold">8</p>
			<span className="text-xl font-bold">.55</span>
			<p className="text-sm font-bold">8</p>
		</div>
	)
}

const SubscriptionQuotes = ({subscription}:{subscription: MarketSubscription}) => {
    return (
		<Card className="mb-12 px-8 w-fit border-2 border-neutral-900">
			<h3 className="mb-6 font-semibold text-neutral-900 text-lg">{subscription.instrument.name}</h3>
			<div className="mb-6 flex justify-around gap-4">
				<div className="flex flex-col">
                    <p className="text-xs font-semibold text-neutral-900/50 self-start">Buy</p>
					<PriceBuy />
				</div>
				<div className="rounded-lg border-l border-neutral-300/50"></div>
				<div className="flex flex-col">
                    <p className="text-xs font-semibold text-neutral-900/50 self-start">Sell</p>
					<PriceSell />
				</div>
			</div>
            <Button type="secondary">Unsubscribe</Button>
		</Card>
	)
}

export default SubscriptionQuotes