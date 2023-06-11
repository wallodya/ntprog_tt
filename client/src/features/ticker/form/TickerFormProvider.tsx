import { ReactNode, createContext, useContext } from 'react'
import { useTickerForm } from './ticker-form.hooks'

type TickerFormContextValue = ReturnType<typeof useTickerForm>

const TickerFormContext = createContext<TickerFormContextValue | null>(null)

export const useTicker = () => {
    const contextValue = useContext<TickerFormContextValue | null>(TickerFormContext)

    if (!contextValue) {
        throw new Error(`Value for context <${TickerFormContext}> was not provided`)
    }

    return contextValue
}

const TickerFormProvider = ({ children }: { children: ReactNode }) => {

    const tickerContextValue: TickerFormContextValue = useTickerForm()

	return (
		<TickerFormContext.Provider value={tickerContextValue}>
			{children}
		</TickerFormContext.Provider>
	)
}

export default TickerFormProvider