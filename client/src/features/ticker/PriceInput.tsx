import Decimal from "decimal.js"
import { useState, ChangeEventHandler, KeyboardEventHandler } from "react"

const PriceInput = ({price, setPrice}: {price: Decimal, setPrice: (p: Decimal) => void}) => {
	// const [price, setPrice] = useState<Decimal>(new Decimal(0))
	const [dollars, setDollars] = useState<string>("")
    const [cents, setCents] = useState<string>("")

	const handleCentsChange: ChangeEventHandler<HTMLInputElement> = e => {
        const val = e.target.value
		setCents(val)
        const num = new Decimal(Number(val))
        setPrice(price.floor().plus(num.greaterThanOrEqualTo(10) ? num.div(100) : num.div(10)))
	}
    
    const handleDollarsChange:ChangeEventHandler<HTMLInputElement> = (e) => {
        const formatDollars = new Intl.NumberFormat().format
        const num = Number(e.target.value.replaceAll(",", ""))
        setDollars(formatDollars(num))
        setPrice(price.minus(price.floor()).plus(new Decimal(num)))
    }

	const preventNonDigitInput: KeyboardEventHandler<HTMLInputElement> = e => {
		if (isNaN(Number(e.key)) && e.key !== "Backspace") {
			e.preventDefault()
		}
	}

	return (
		<div className="mb-6 flex py-3 rounded-lg border-none text-slate-100 bg-gray-700 focus-within:outline focus-within:outline-blue-500">
			<span className="ml-5 mr-2 text-gray-400">$</span>
			<input
				name="price-dollars"
				value={dollars}
                onChange={handleDollarsChange}
				placeholder="00"
				id=""
				className="text-right bg-transparent focus:outline-none"
				onKeyDown={preventNonDigitInput}
			/>
			<span className="mx-1 text- font-bold text-gray-400">.</span>
			<input
				placeholder={"00"}
                value={cents}
                onChange={handleCentsChange}
				name="price-cents"
				id=""
				className="w-12 flex justify-center bg-transparent focus:outline-none"
				maxLength={2}
				onKeyDown={preventNonDigitInput}
			/>
		</div>
	)
}

export default PriceInput