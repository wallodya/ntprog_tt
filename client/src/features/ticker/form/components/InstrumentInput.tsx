import FormFieldError from "components/ui/FormFieldError"
import { useTicker } from "../TickerFormProvider"
import { Instrument } from "models/Base"

const MOCK_INSTRUMENT_DATA: Instrument[] = [
    {
        instrumentId: 1,
        name: "CHN/RUB",
    },
    {
        instrumentId: 2,
        name: "EUR/RUB",
    },
    {
        instrumentId: 3,
        name: "EUR/USD",
    },
    {
        instrumentId: 4,
        name: "USD/RUB",
    },
    {
        instrumentId: 5,
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
                        <option key={i.instrumentId} value={i.instrumentId}>{i.name}</option>
                    )
                }
			</select>
		</>
	)
}

export default InstrumentInput