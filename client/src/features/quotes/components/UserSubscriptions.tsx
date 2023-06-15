import Button from "components/ui/Button"
import { MarketSubscription, Quote } from "models/Base"
import SubscriptionQuotes from "./SubscriptionQuotes"
import QuotesChart from "../chart/QuotesChartContainer"
import { useState } from "react"

const UserSubcriptions = ({
	subscriptions,
}: {
	subscriptions: MarketSubscription[]
}) => {

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
				<Button type="primary">New subscription</Button>
			</div>
            <QuotesChart quotes={chartData}/>
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
	)
}

export default UserSubcriptions
