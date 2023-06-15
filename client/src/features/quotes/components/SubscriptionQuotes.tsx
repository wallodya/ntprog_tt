import Button from "components/ui/Button"
import Card from "components/ui/Card"
import { MarketSubscription, Quote } from "models/Base"
import { useMarketSubscription } from "../subscriptions.hooks"
import QuotePrice from "./QuotePrice"
import UnsubscribeButton from "./UnsubscribeButton"




const SubscriptionQuotes = ({
	subscription,
    standalone,
    renderChart
}: {
	subscription: MarketSubscription,
    standalone?: boolean,
    renderChart?: (instrumentId: number, quotes: Quote[]) => void
}) => {
	const { latestQuote, unsubscribe, quotes } = useMarketSubscription(
		subscription.subscriptionId
	)

	return (
		<Card className="px-8 w-fit border-2 border-neutral-900">
			<div className="mb-6 flex item-baseline justify-between gap-2">
				<h3 className="font-semibold text-neutral-900 text-lg">
					{subscription.instrument.name}
				</h3>
				<UnsubscribeButton
					instrumentName={subscription.instrument.name}
					handleUnsubscribe={unsubscribe}
				/>
			</div>
			<div className="flex justify-around gap-4">
				<div className="flex flex-col">
					<p className="text-xs font-semibold text-neutral-900/50 self-start">
						Buy
					</p>
					<span className="text-red-600">
						<QuotePrice price={latestQuote.bid} />
					</span>
					<p className="text-sm font-bold text-neutral-900/50">
						x{latestQuote.bidAmount.toString()}
					</p>
				</div>
				<div className="rounded-lg border-l border-neutral-300/50"></div>
				<div className="flex flex-col">
					<p className="text-xs font-semibold text-neutral-900/50 self-start">
						Sell
					</p>
					<span className="text-green-600">
						<QuotePrice price={latestQuote.offer} />
					</span>
					<p className="text-sm font-bold text-neutral-900/50">
						x{latestQuote.offerAmount.toString()}
					</p>
				</div>
			</div>
			{standalone && renderChart && (
				<Button
					type="tetriary"
					className="mt-4 text-sm text-neutral-900/50 hover:text-neutral-900 border-none p-0"
					onClick={() =>
						renderChart(
							subscription.instrument.instrumentId,
							quotes
						)
					}
				>
					Show on chart
				</Button>
			)}
		</Card>
	)
}

export default SubscriptionQuotes
