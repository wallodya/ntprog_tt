import FormFieldError from "components/ui/FormFieldError"
import FormInput from "components/ui/FormInput"
import { useOrder } from "../OrderFormProvider"
import { FieldError } from "react-hook-form"

const AmountInput = () => {
    const {
		register,
		formState: {
			errors: { amount: amountFieldError },
		},
	} = useOrder()
    return (
		<>
			<label
				htmlFor="amount"
				className="font-semibold text-neutral-900/50"
			>
				Enter amount
			</label>
			<FormFieldError err={amountFieldError as FieldError} />
			<FormInput
                type="number"
				placeholder="Amount"
				{...register("amount")}
				className="mb-12 w-full"
			/>
		</>
	)
}

export default AmountInput