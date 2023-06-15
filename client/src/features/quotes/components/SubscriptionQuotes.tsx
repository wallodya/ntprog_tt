import Button from "components/ui/Button"
import Card from "components/ui/Card"
import Decimal from "decimal.js"
import { MarketSubscription, Quote } from "models/Base"
import { useMarketSubscription } from "../use-subscriptions.hook"
import * as AlertDialog from "@radix-ui/react-alert-dialog"

const QuotePrice = ({ price }: { price: Decimal }) => {
	const priceStr = price.toDecimalPlaces(3).toString()
	const [dollars, cents] = priceStr.split(".")
	const centsEmphasis = cents ? `${cents.slice(0, 2)}0`.slice(0, 2) : "00"
	const centsRemainder = cents && cents.length >= 3 ? cents.slice(2) : "0"

	return (
		<div className="mb-2 w-full flex justify-center items-baseline">
			<p className="text-sm font-bold">{dollars}</p>
			<span className="text-xl font-bold">.{centsEmphasis}</span>
			<p className="text-sm font-bold">{centsRemainder}</p>
		</div>
	)
}

const UnsubscribeButton = ({
	handleUnsubscribe,
	instrumentName,
}: {
	instrumentName: string
	handleUnsubscribe: () => void
}) => {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>
                <Button type="tetriary" className="px-2 py-1 text-sm">Unsubscribe</Button>
            </AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed z-40 h-screen w-screen inset-0 bg-gray-950/70" />
				<AlertDialog.Content>
					<div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none">
						<Card className="pointer-events-auto">
							<AlertDialog.Title className="text-lg font-bold mb-2">Are you sure?</AlertDialog.Title>
							<AlertDialog.Description className="mb-4">
								You wont't be notified about {instrumentName}{" "}
								quote updates
							</AlertDialog.Description>
                            <div className="flex justify-end gap-2">

							<AlertDialog.Cancel asChild>
								<Button type="secondary">Cancel</Button>
							</AlertDialog.Cancel>
							<AlertDialog.Action asChild>
								<Button type="primary" onClick={handleUnsubscribe}>Unscubscribe</Button>
							</AlertDialog.Action>
                            </div>
						</Card>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
}

const SubscriptionQuotes = ({
	subscription,
}: {
	subscription: MarketSubscription
}) => {
	const { latestQuote, unsubscribe } = useMarketSubscription(
		subscription.subscriptionId
	)

	return (
		<Card className="mb-12 px-8 w-fit border-2 border-neutral-900">
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
		</Card>
	)
}

export default SubscriptionQuotes
