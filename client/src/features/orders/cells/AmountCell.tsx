import { OrderSide } from "types/Enums"

const AmountCell = ({ amount, side }: { amount: number; side: OrderSide }) => {
	const format = new Intl.NumberFormat().format

	const textColor = side === OrderSide.buy ? "text-red-600" : "text-green-600"
	return (
		<div className={`w-full text-right ${textColor}`}>{format(amount)}</div>
	)
}

export default AmountCell
