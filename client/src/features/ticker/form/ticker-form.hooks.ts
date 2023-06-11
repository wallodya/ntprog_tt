import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useState } from "react"
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"
import { OrderSide } from "types/Enums"
import { TickerFormData, tickerSchema } from "./ticker.schema"

export const useTickerForm = () => {
    const formControls = useForm<TickerFormData>({
		resolver: zodResolver(tickerSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	})

    const onSubmit: SubmitHandler<TickerFormData> = data => {
		console.log("data: ")
		console.log(data)
	}

	const onError: SubmitErrorHandler<TickerFormData> = error => {
		console.log("err: ", error)
	}

	const [price, setPrice] = useState<Decimal>(new Decimal(0))

    const handleOrderSide = (orderSide: "buy" | "sell") => {
		if (orderSide === "buy") {
			formControls.setValue("side", OrderSide.buy)
		} else {
			formControls.setValue("side", OrderSide.sell)
		}
        formControls.setValue("price", price.toNumber())
	}

    return {
        ...formControls,
        handleSubmit: formControls.handleSubmit(onSubmit, onError),
        handleOrderSide,
        tickerPrice: price,
        setTickerPrice: setPrice
    }
}

