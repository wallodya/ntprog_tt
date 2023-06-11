import { OrderSide } from "types/Enums";
import { z } from "zod";

const orderSideValues = Object.values(OrderSide).filter(Number.isInteger)

export const tickerSchema = z.object({
	instrument: z.string(),
	amount: z
		.string()
		.transform(Number)
		.refine(num => num > 0 && Number.isInteger(num), {
			message: "Amount field is invalid",
		}),
	side: z.number().refine(num => orderSideValues.includes(num)),
    price: z.number().min(0.01)
})

export type TickerFormData = z.infer<typeof tickerSchema>