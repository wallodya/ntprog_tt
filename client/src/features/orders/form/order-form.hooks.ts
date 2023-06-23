import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { useState } from "react"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { OrderSide } from "types/Enums"
import { useSocket } from "utils/socket/SocketProvider"
import {
	RawOrderFormData,
	OrderFormData,
	orderFormSchema,
} from "utils/validation/schemas/order-form.schema"

export const useOrderForm = () => {
    const socket = useSocket()
    const formControls = useForm<RawOrderFormData, any, OrderFormData>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			instrument: "1",
			amount: "100",
		},
		mode: "onSubmit",
		reValidateMode: "onChange",
	})

    const onSubmit: SubmitHandler<OrderFormData> = data => {
        socket.placeOrder(data)
	}

	const onError: SubmitErrorHandler<RawOrderFormData> = error => {
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
        orderPrice: price,
        setOrderPrice: setPrice
    }
}

