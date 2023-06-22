import { ReactNode, createContext, useContext } from 'react'
import { useOrderForm } from './order-form.hooks'

type OrderFormContextValue = ReturnType<typeof useOrderForm>

const OrderFormContext = createContext<OrderFormContextValue | null>(null)

export const useOrder = () => {
    const contextValue = useContext<OrderFormContextValue | null>(OrderFormContext)

    if (!contextValue) {
        throw new Error(`Value for context <${OrderFormContext}> was not provided`)
    }

    return contextValue
}

const TickerFormProvider = ({ children }: { children: ReactNode }) => {

    const tickerContextValue: OrderFormContextValue = useOrderForm()

	return (
		<OrderFormContext.Provider value={tickerContextValue}>
			{children}
		</OrderFormContext.Provider>
	)
}

export default TickerFormProvider