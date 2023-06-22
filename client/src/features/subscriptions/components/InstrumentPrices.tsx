import { Quote } from "models/Base"
import QuotePrice from "./QuotePrice"

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

export default InstrumentPrices