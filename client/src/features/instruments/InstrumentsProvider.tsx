import { useQuery } from "@tanstack/react-query"
import { isServerHttpException } from "features/auth/types/auth.types"
import { Instrument } from "models/Base"
import { ReactNode, createContext, useContext } from "react"
import { toast } from "react-toastify"
import instrumentSchema, { instrumentsDataSchema } from "./instrument.schema"

const fetchInstruments = async (): Promise<Instrument[]> => {
    const url = process.env["REACT_APP_SERVER_URL"]
    
    if (!url) {
        return []
    }

    const response = await fetch(
        `${url}/instruments`,
        {
            method: "GET",
            credentials: "include",
        }
    )

    const resData = await response.json()

    if (![200, 201].includes(response.status)) {

        if (isServerHttpException(resData)) {
            if (typeof resData.detail === "string") {
                toast.error(resData.detail)
                return []
            }
            
            console.log(resData.detail)

        }

        return []
    }

    const instrumentsData = instrumentsDataSchema.safeParse(resData)

    if (instrumentsData.success) {
        return instrumentsData.data
    }
    
    return []
}

const initialContext: Instrument[] = []

const InstrumentsContext = createContext<Instrument[]>(initialContext)

export const useInstruments = () => useContext(InstrumentsContext)

const InstrumentsProvider = ({ children }: { children: ReactNode }) => {

    const { data } = useQuery(["instruments"], fetchInstruments)

	return (
		<InstrumentsContext.Provider value={data ?? []}>
			{children}
		</InstrumentsContext.Provider>
	)
}

export default InstrumentsProvider
