import FormFieldError from "components/ui/FormFieldError"
import { useTicker } from "../TickerFormProvider"

const MOCK_INSTRUMENT_DATA: {
    instrument: number,
    name: string
}[] = [
    {
        instrument: 1,
        name: "CHN/RUB",
    },
    {
        instrument: 2,
        name: "EUR/RUB",
    },
    {
        instrument: 3,
        name: "EUR/USD",
    },
    {
        instrument: 4,
        name: "USD/RUB",
    },
    {
        instrument: 5,
        name: "BYN/RUB",
    },
]

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
                {
                    MOCK_INSTRUMENT_DATA.map(i => 
                        <option key={i.instrument} value={i.instrument}>{i.name}</option>
                    )
                }
			</select>
		</>
	)
}

export default InstrumentInput