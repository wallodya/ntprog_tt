import FormFieldError from "components/ui/FormFieldError"
import { useInstruments } from "features/instruments/InstrumentsProvider"
import { useOrder } from "../OrderFormProvider"

const InstrumentInput = () => {
    const {
		register,
		formState: {
			errors: { instrument: instrumentFieldError },
		},
	} = useOrder()

    const instruments = useInstruments()

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
				className="px-5 py-3 w-full mb-12 rounded-lg border border-neutral-500/50 text-neutral-900 bg-transparent"
			>
                {
                    instruments.map(i => 
                        <option key={i.instrumentId} value={String(i.instrumentId)}>{i.name}</option>
                    )
                }
			</select>
		</>
	)
}

export default InstrumentInput