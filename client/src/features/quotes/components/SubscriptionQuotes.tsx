import Button from "components/ui/Button"
import Card from "components/ui/Card"
import { Instrument, MarketSubscription, Quote } from "models/Base"
import { useMarketSubscription } from "../subscriptions.hooks"
import QuotePrice from "./QuotePrice"
import UnsubscribeButton from "./UnsubscribeButton"

const InstrumentPrices = ({ quote }: { quote: Quote }) => {
	return (
		<div className="flex justify-around gap-4">
			<div className="flex flex-col">
				<p className="text-xs font-semibold text-neutral-900/50 self-start">
					Buy
				</p>
				<span className="text-red-600">
					<QuotePrice price={quote.offer} />
				</span>
				<p className="text-sm font-bold text-neutral-900/50">
					x{quote.bidAmount.toString()}
				</p>
			</div>
			<div className="rounded-lg border-l border-neutral-300/50"></div>
			<div className="flex flex-col">
				<p className="text-xs font-semibold text-neutral-900/50 self-start">
					Sell
				</p>
				<span className="text-green-600">
					<QuotePrice price={quote.bid} />
				</span>
				<p className="text-sm font-bold text-neutral-900/50">
					x{quote.offerAmount.toString()}
				</p>
			</div>
		</div>
	)
}

const InstrumentPosition = ({instrument}:{instrument: Instrument}) => {
    const formatPosition = new Intl.NumberFormat("us", {
        style: "currency",
		currency: "USD",
		currencyDisplay: "narrowSymbol",
	}).format
    return (
		<div className="mt-2 flex flex-col gap-2">
			<p className="text-sm font-semibold text-neutral-900/50">
				Position
			</p>
			<div className="flex justify-between border-b border-neutral-300/50">
				<p className="text-xs self-end font-semibold text-neutral-900/50">Sell</p>
				<p className="text-sm font-semibold text-neutral-900/50">{formatPosition(instrument.sellPosition.toNumber())}</p>
			</div>
			<div className="flex justify-between border-b border-neutral-300/50">
				<p className="text-xs self-end font-semibold text-neutral-900/50">Buy</p>
				<p className="text-sm font-semibold text-neutral-900/50">{formatPosition(instrument.buyPosition.toNumber())}</p>
			</div>
		</div>
	)
}

const SubscriptionQuotes = ({
	subscription,
	standalone,
	renderChart,
}: {
	subscription: MarketSubscription
	standalone?: boolean
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
			<InstrumentPrices quote={latestQuote}/>
            <InstrumentPosition instrument={subscription.instrument}/>
			{standalone && renderChart && (
				<Button
					styleType="tetriary"
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
