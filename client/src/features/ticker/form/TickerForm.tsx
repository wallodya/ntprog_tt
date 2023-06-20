import MarketQuotes from "./components/MarketQuotes"

import { useTicker } from "./TickerFormProvider"
import AmountInput from "./components/AmountInput"
import InstrumentInput from "./components/InstrumentInput"
import TickerOrderActions from "./components/TickerOrderActions"
import PriceInput from "./components/PriceInput"
import { useAuth } from "features/auth/AuthProvider"
import SubscriptionQuotes from "features/quotes/components/SubscriptionQuotes"
import { useEffect, useState } from "react"
import { MarketSubscription } from "models/Base"
import Card from "components/ui/Card"
import Button from "components/ui/Button"
import { useSocket } from "utils/socket/SocketProvider"
// import MarketQuotes from "features/quotes/MarketQuotes"

const TickerForm = () => {
    const userData = useAuth()
	const [subscription, setSubscription] = useState<MarketSubscription | null>(
		userData.user
			? userData.subscriptions.find(
					sub => sub.instrument.instrumentId === 1
			  ) ?? null
			: null
	)
	const { handleSubmit, watch } = useTicker()
    const socket = useSocket()

	useEffect(() => {
		if (!userData.user) {
			return
		}

		const { unsubscribe } = watch(values => {
			setSubscription(
				userData.subscriptions.find(
					sub =>
						sub.instrument.instrumentId ===
						Number(values.instrument)
				) ?? null
			)
		})
		return () => unsubscribe()
	}, [])

    const handleSubscribe = () => {
        if (socket.connection && subscription) {
            socket.subscribeMarketData(subscription.instrument.instrumentId)
        }
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

export default TickerForm
