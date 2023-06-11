import Card from "components/ui/Card"

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

const MarketQuotes = () => {
    return (
		<Card className="mb-12 bg-gradient-to-br from-neutral-100 to-violet-100 shadow-violet-200">
			<h3 className="mb-6 font-semibold text-neutral-900 text-lg">Market quotes</h3>
			<div className="flex justify-around">
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
		</Card>
	)
}

export default MarketQuotes