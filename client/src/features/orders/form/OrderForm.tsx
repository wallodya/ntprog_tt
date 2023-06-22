import { useOrder } from "./OrderFormProvider"
import AmountInput from "./components/AmountInput"
import InstrumentInput from "./components/InstrumentInput"
import TickerOrderActions from "./components/OrderFormActions"
import PriceInput from "./components/PriceInput"
import { useAuth } from "features/auth/AuthProvider"
import SubscriptionQuotes from "features/subscriptions/components/TickerQuotes"
import { useEffect, useState } from "react"
import Card from "components/ui/Card"
import Button from "components/ui/Button"
import { useSubscriptions } from "features/subscriptions/SubscriptionsProvider"
import { MarketDataUpdate } from "models/ServerMessages"

const useSelectedInstrument = () => {
    const { user } = useAuth()
    const { watch } = useOrder()
    const { subscriptions } = useSubscriptions()

    const [subscription, setSubscription] = useState<MarketDataUpdate | null>(
		user
			? subscriptions.find(
					sub => sub.instrument.instrumentId === 1
			  ) ?? null
			: null
	)
    const [instrumentId, setInstrumentId] = useState<number>(1)

    useEffect(() => {
		if (!user) {
			return
		}

		const { unsubscribe } = watch(values => {
			setSubscription(
				subscriptions.find(
					sub =>
						sub.instrument.instrumentId ===
						Number(values.instrument)
				) ?? null
			)
            setInstrumentId(Number(values.instrument ?? 1))
		})
		return () => unsubscribe()
	}, [])

    return { subscription, instrumentId }
}

const OrderForm = () => {
    const { user } = useAuth()

	const { handleSubmit } = useOrder()
    const { subscribe } = useSubscriptions()
    const { subscription, instrumentId } = useSelectedInstrument()

    const handleSubscribe = () => {
        subscribe(instrumentId)
    }

    if (!user) {
        return null
    }

	return (
		<form
			className="flex flex-col items-center md:grid grid-cols-2 grid-rows-5 gap-8"
			id="ticker-form"
			onSubmit={handleSubmit}
		>
			<div className="col-start-1 row-start-1 row-span-2">
				<InstrumentInput />
			</div>
			<div className="col-start-1 row-start-3 row-span-2">
				<AmountInput />
			</div>

			<div className="relative col-start-2 row-start-1 row-span-2 self-start">
				<div
					className={
						"absolute bottom-1/2 right-1/2 translate-x-2/4 translate-y-2/4 ml-auto"
					}
				>
					{subscription && (
						<SubscriptionQuotes subscription={subscription} />
					)}
				</div>
				<div className={`${subscription ? "opacity-0 pointer-events-none" : ""}`}>
					<Card className="px-8 w-full border-2 border-neutral-900">
						<h3 className="mb-2 font-semibold text-neutral-900 text-lg">
							No data
						</h3>
						<p className="mb-4 text-sm font-semibold text-neutral-900/50 self-start">
							Subscribe to market updates
							<br />
							to recieve instruments latest market quotes
						</p>
						<Button
							
							onClick={handleSubscribe}
							styleType="secondary"
                            type="button"
							className="text-sm px-2 py-2"
						>
							Subscribe
						</Button>
					</Card>
				</div>
			</div>
			<div className="clos-start-2 row-start-3 row-span-2">
				<PriceInput />
			</div>
			<div className="col-start-2 row-start-5 col-span-1">
				<TickerOrderActions />
			</div>
		</form>
	)
}

export default OrderForm
