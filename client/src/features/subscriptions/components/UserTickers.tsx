import { Quote } from "models/Base"
import { useState } from "react"
import { useSubscriptions } from "../SubscriptionsProvider"
import QuotesChart from "../chart/QuotesChartContainer"
import SubscriptionQuotes from "./TickerQuotes"
import NewSubscriptionButton from "./new-subscription/NewSubscriptionButton"

const UserTickers = () => {
    const {subscriptions} = useSubscriptions()
    const [chartData, setChartData] = useState<Quote[] | null>(null)
    const [instrumentOnChart, setInstrumentOnChart] = useState<number | null>(null)

    const renderChart = (instrumentId: number, quotes: Quote[]) => {
        if (instrumentId === instrumentOnChart) {
            setChartData(null)
            setInstrumentOnChart(null)
            return
        }
        if (!quotes) {
            return
        }
        setChartData(quotes)
        setInstrumentOnChart(instrumentId)
    }

	return (
		<>
			<div className="mb-8 w-full flex justify-between items-baseline">
				<h2 className="font-bold text-2xl">Subscriptions</h2>
				<NewSubscriptionButton/>
			</div>
			{subscriptions.length === 0 ? (
				<p>You don't have any subscriptions yet</p>
			) : (
				<>
					<QuotesChart quotes={chartData} />
					<div className="mt-8 flex gap-4 overflow-x-scroll">
						{subscriptions.map(subscription => (
							<SubscriptionQuotes
								standalone
								subscription={subscription}
								key={subscription.subscriptionId}
								renderChart={renderChart}
							/>
						))}
					</div>
				</>
			)}
		</>
	)
}

export default UserTickers
