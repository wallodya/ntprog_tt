import { Instrument } from "models/Base"

const InstrumentPosition = ({ instrument }: { instrument: Instrument }) => {
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
				<p className="text-xs self-end font-semibold text-neutral-900/50">
					Sell
				</p>
				<p className="text-sm font-semibold text-neutral-900/50">
					{formatPosition(instrument.sellPosition.toNumber())}
				</p>
			</div>
			<div className="flex justify-between border-b border-neutral-300/50">
				<p className="text-xs self-end font-semibold text-neutral-900/50">
					Buy
				</p>
				<p className="text-sm font-semibold text-neutral-900/50">
					{formatPosition(instrument.buyPosition.toNumber())}
				</p>
			</div>
		</div>
	)
}

export default InstrumentPosition
