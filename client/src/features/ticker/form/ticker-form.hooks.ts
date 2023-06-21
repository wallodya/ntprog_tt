import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useState } from "react"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { OrderSide } from "types/Enums"
import { RawTickerFormData, TickerFormData, tickerSchema } from "./ticker.schema"
import { useSocket } from "utils/socket/SocketProvider"

export const useTickerForm = () => {
    const socket = useSocket()
    const formControls = useForm<RawTickerFormData,any,TickerFormData>({
		resolver: zodResolver(tickerSchema),
        defaultValues: {
            instrument: "1",
            amount: "100"
        },
		mode: "onSubmit",
		reValidateMode: "onChange",
	})

    const onSubmit: SubmitHandler<TickerFormData> = data => {
        socket.placeOrder(data)
	}

	const onError: SubmitErrorHandler<RawTickerFormData> = error => {
		console.log("err: ", error)
	}

	const [price, setPrice] = useState<Decimal>(new Decimal(0))

    const handleOrderSide = (orderSide: "buy" | "sell") => {
		if (orderSide === "buy") {
			formControls.setValue("side", OrderSide.buy)
		} else {
			formControls.setValue("side", OrderSide.sell)
		}
        formControls.setValue("price", price)
	}

    return {
        ...formControls,
        handleSubmit: formControls.handleSubmit(onSubmit, onError),
        handleOrderSide,
        tickerPrice: price,
        setTickerPrice: setPrice
    }
}

