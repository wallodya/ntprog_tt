import Button from "components/ui/Button"
import { useTicker } from "../TickerFormProvider"

const TickerOrderActions = () => {
    const { handleOrderSide } = useTicker()

    return (
		<div className="flex gap-2">
			<Button
				onClick={() => handleOrderSide("buy")}
				styleType="primary"
				className="w-full bg-red-700 border-red-700 hover:text-red-700 text-neutral-100"
			>
				Buy
			</Button>
			<Button
				onClick={() => handleOrderSide("sell")}
				styleType="primary"
				className="w-full bg-green-700 border-green-700 hover:text-green-700 text-neutral-100"
			>
				Sell
			</Button>
		</div>
	)
}

export default TickerOrderActions