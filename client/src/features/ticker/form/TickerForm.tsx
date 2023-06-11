import MarketQuotes from "./components/MarketQuotes"
import PriceInput from "./components/PriceInput"

import { useTicker } from "./TickerFormProvider"
import AmountInput from "./components/AmountInput"
import InstrumentInput from "./components/InstrumentInput"
import TickerOrderActions from "./components/TickerOrderActions"


const TickerForm = () => {

	const { handleSubmit } = useTicker()

	return (
		<form
			className="flex flex-col"
			id="ticker-form"
			onSubmit={handleSubmit}
		>
			<InstrumentInput />

			<AmountInput />

			<MarketQuotes />

			<PriceInput />

			<TickerOrderActions />
		</form>
	)
}

export default TickerForm
