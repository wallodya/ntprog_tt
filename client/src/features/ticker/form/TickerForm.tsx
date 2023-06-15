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
// import MarketQuotes from "features/quotes/MarketQuotes"


const TickerForm = () => {

    const [subscription, setSubscription] = useState<MarketSubscription | null>()
	const { handleSubmit, watch } = useTicker()
    const userData = useAuth()

    useEffect(() => {
        if (!userData.user) {
            return
        }
        const { unsubscribe } = watch((values) => {
            setSubscription(
				userData.subscriptions.find(
					sub => sub.instrument.instrumentId === Number(values.instrument)
				) ?? null
			)
        })
        return () => unsubscribe()
    },[])

	return (
		<form
			className="flex flex-col"
			id="ticker-form"
			onSubmit={handleSubmit}
		>
			<InstrumentInput/>

			<AmountInput />

			{subscription ? (
				<SubscriptionQuotes subscription={subscription} />
			) : (
				<Card className="mb-12 px-8 w-full border-2 border-neutral-900">
                    <h3 className="mb-2 font-semibold text-neutral-900 text-lg">
					    No data
				    </h3>
                    <p className="mb-4 text-sm font-semibold text-neutral-900/50 self-start">
						Subscribe to market updates<br/> 
                        to recieve instruments latest market quotes
					</p>
                    <Button type="secondary" className="text-sm px-2 py-2">Subscribe</Button>
                </Card>
			)}

			<PriceInput />

			<TickerOrderActions />
		</form>
	)
}

export default TickerForm
