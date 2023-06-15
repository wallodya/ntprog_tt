import Decimal from "decimal.js"

const QuotePrice = ({ price }: { price: Decimal }) => {
	const priceStr = price.toDecimalPlaces(3).toString()
	const [dollars, cents] = priceStr.split(".")
	const centsEmphasis = cents ? `${cents.slice(0, 2)}0`.slice(0, 2) : "00"
	const centsRemainder = cents && cents.length >= 3 ? cents.slice(2) : "0"

	return (
		<div className="mb-2 w-full flex justify-center items-baseline">
			<p className="text-sm font-bold">{dollars}</p>
			<span className="text-xl font-bold">.{centsEmphasis}</span>
			<p className="text-sm font-bold">{centsRemainder}</p>
		</div>
	)
}

export default QuotePrice