import MarketQuotes from "./components/MarketQuotes"

import { useTicker } from "./TickerFormProvider"
import AmountInput from "./components/AmountInput"
import InstrumentInput from "./components/InstrumentInput"
import TickerOrderActions from "./components/TickerOrderActions"
import PriceInput from "./components/PriceInput"
// import MarketQuotes from "features/quotes/MarketQuotes"


const TickerForm = () => {

	const { handleSubmit, watch } = useTicker()

	return (
		<form
			className="flex flex-col"
			id="ticker-form"
			onSubmit={handleSubmit}
		>
			<InstrumentInput />

			<AmountInput />

			<MarketQuotes/>

			<PriceInput />

			<TickerOrderActions />
		</form>
	)
}

export default TickerForm
