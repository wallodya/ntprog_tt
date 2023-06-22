import Decimal from "decimal.js"
import { useState, ChangeEventHandler, KeyboardEventHandler } from "react"
import { useOrder } from "../OrderFormProvider"
import FormFieldError from "components/ui/FormFieldError"
import { FieldError } from "react-hook-form"

const PriceInput = () => {
    const {
		orderPrice: price,
		setOrderPrice: setPrice,
		formState: {
			errors: { price: priceFieldError },
		},
	} = useOrder()

	const [dollars, setDollars] = useState<string>("")
    const [cents, setCents] = useState<string>("")

	const handleCentsChange: ChangeEventHandler<HTMLInputElement> = e => {
        const val = e.target.value

		setCents(val)
        const num = new Decimal(Number(val))

        setPrice(
			price
				.floor()
				.plus(
					num.greaterThanOrEqualTo(10) || val.startsWith("0")
						? num.div(100)
						: num.div(10)
				)
		)
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
		<>
			<label
				htmlFor="price-dollars"
				className="font-semibold text-neutral-900/50"
			>
				Your price
			</label>
			<FormFieldError err={priceFieldError as FieldError} />  
			<div className="mb-12 w-full flex py-3 rounded-lg border border-neutral-500/50 text-neutral-900 bg-transparent focus-within:outline focus-within:outline-blue-500">
				<span className="ml-5 mr-2 text-neutral-400">$</span>
				<input
					name="price-dollars"
					value={dollars}
					onChange={handleDollarsChange}
					placeholder="00"
					id=""
					className="ml-auto text-right font-semibold text-neutral-900/80 bg-transparent focus:outline-none"
					onKeyDown={preventNonDigitInput}
				/>
				<span className="mx-1 font-bold text-neutral-400">.</span>
				<input
					placeholder={"00"}
					value={cents}
					onChange={handleCentsChange}
					name="price-cents"
					id=""
					className="w-12 flex font-semibold text-neutral-900/80 justify-center bg-transparent focus:outline-none"
					maxLength={2}
					onKeyDown={preventNonDigitInput}
				/>
			</div>
		</>
	)
}

export default PriceInput