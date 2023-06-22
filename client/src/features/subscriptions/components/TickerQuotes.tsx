import Button from "components/ui/Button"
import Card from "components/ui/Card"
import { Quote } from "models/Base"
import { MarketDataUpdate } from "models/ServerMessages"
import InstrumentPosition from "./InstrumentPosition"
import InstrumentPrices from "./InstrumentPrices"
import UnsubscribeButton from "./UnsubscribeButton"
import { useSubscriptions } from "../SubscriptionsProvider"
import { useMemo } from "react"
import Decimal from "decimal.js"

export const useLatestQuote = (quotes: Quote[]) => {
    const nullQuote: Quote = useMemo(() => ({
        bid: new Decimal(0),
        bidAmount: new Decimal(0),
        offer: new Decimal(0),
        offerAmount: new Decimal(0),
        timestamp: Date.now()
    }),[])
    return quotes[0] ?? nullQuote
}

const SubscriptionQuotes = ({
	subscription,
	standalone,
	renderChart,
}: {
	subscription: MarketDataUpdate
	standalone?: boolean
	renderChart?: (instrumentId: number, quotes: Quote[]) => void
}) => {

    const latestQuote = useLatestQuote(subscription.quotes)
    const { unsubscribe } = useSubscriptions()

    const handleUnsubscribe = () => {
        unsubscribe(subscription.subscriptionId)
    }

	return (
		<Card className="px-8 w-fit border-2 border-neutral-900">
			<div className="mb-6 flex item-baseline justify-between gap-2">
				<h3 className="font-semibold text-neutral-900 text-lg">
					{subscription.instrument.name}
				</h3>
				<UnsubscribeButton
					instrumentName={subscription.instrument.name}
					handleUnsubscribe={handleUnsubscribe}
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
							subscription.quotes
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
