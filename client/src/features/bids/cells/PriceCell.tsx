import Decimal from "decimal.js"
import { OrderSide } from "types/Enums"

const PriceCell = ({dec, side}: {dec: Decimal, side: OrderSide}) => {
    const textColor = side === OrderSide.buy ? "text-red-600" : "text-green-600"
    const format = Intl.NumberFormat("us", {
		style: "currency",
		currency: "USD",
		currencyDisplay: "narrowSymbol",
	}).format
    return (
        <div className={`w-full text-right font-semibold ${textColor}`}>{format(dec.toNumber())}</div>
    )
}

export default PriceCell