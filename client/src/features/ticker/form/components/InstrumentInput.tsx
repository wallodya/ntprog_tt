import FormFieldError from "components/ui/FormFieldError"
import { useTicker } from "../TickerFormProvider"

const InstrumentInput = () => {
    const {
		register,
		formState: {
			errors: { instrument: instrumentFieldError },
		},
	} = useTicker()

    return (
		<>
			<label
				htmlFor="instrument"
				className="font-semibold text-neutral-900/50"
			>
				Choose instrument
			</label>
			<FormFieldError err={instrumentFieldError} />
			<select
				{...register("instrument")}
				className="px-5 py-3 mb-12 rounded-lg border border-neutral-500/50 text-neutral-900 bg-transparent"
			>
				<option value={"CHN/RUB"}>CHN/RUB</option>
				<option value={"EUR/RUB"}>EUR/RUB</option>
				<option value={"EUR/USD"}>EUR/USD</option>
				<option value={"USD/RUB"}>USD/RUB</option>
				<option value={"BYN/RUB"}>BYN/RUB</option>
			</select>
		</>
	)
}

export default InstrumentInput