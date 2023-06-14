import { OrderSide } from "types/Enums"

const OrderSideCell = ({side}:{side: OrderSide}) => {
    const bgColor = side === OrderSide.buy ? "bg-red-600" : "bg-green-600"
    const text = side === OrderSide.buy ? "Buy" : "Sell"
    return (
		<div className="w-full flex items-center justify-center">
			<span
				className={`px-2 py-1 text-sm font-bold text-neutral-100 rounded-md ${bgColor}`}
			>
				{text}
			</span>
		</div>
	)
}

export default OrderSideCell