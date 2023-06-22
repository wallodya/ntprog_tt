import TickerForm from "./OrderForm"
import TickerFormProvider from "./OrderFormProvider"

const NewOrder = () => {
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

export default NewOrder
