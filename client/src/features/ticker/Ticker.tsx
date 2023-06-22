import TickerForm from "./form/TickerForm"
import TickerFormProvider from "./form/TickerFormProvider"

const Ticker = () => {
	return (
		<>
			<h2 className="mb-6 text-neutral-900 font-bold text-2xl">
				New order
			</h2>
			<TickerFormProvider>
				<TickerForm />
			</TickerFormProvider>
		</>
	)
}

export default Ticker
