import FormFieldError from "components/ui/FormFieldError"
import FormInput from "components/ui/FormInput"
import { useTicker } from "../TickerFormProvider"

const AmountInput = () => {
    const {
		register,
		formState: {
			errors: { amount: amountFieldError },
		},
	} = useTicker()
    return (
		<>
			<label
				htmlFor="amount"
				className="font-semibold text-neutral-900/50"
			>
				Enter amount
			</label>
			<FormFieldError err={amountFieldError} />
			<FormInput
				placeholder="Amount"
				{...register("amount")}
				className="mb-12 w-full"
			/>
		</>
	)
}

export default AmountInput