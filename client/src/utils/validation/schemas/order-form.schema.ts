import Decimal from "decimal.js";
import { OrderSide } from "types/Enums";
import { z } from "zod";

const orderSideValues = Object.values(OrderSide).filter(Number.isInteger)

export const orderFormSchema = z.object({
	instrument: z.string().transform(Number),
	amount: z
		.string()
        .transform(Number)
        .refine(num => !isNaN(num), {
            message: "Amount must be a number"
        })
        .transform(num => new Decimal(num))
		.refine(num => num.greaterThan(0), {
			message: "Amount must be greater then 0",
		})
        .refine(num => num.isInteger(), {
            message: "Amount can't be fractional"
        }),
	side: z.number().refine(num => orderSideValues.includes(num)),
	price: z
		.custom<Decimal>(data => data instanceof Decimal)
		.refine(num => num.greaterThan(0), {
            message: "Price must be greater than 0"
        }),
})

export type RawOrderFormData = {
    instrument: string,
    amount: string,
    side: number,
    price: Decimal
}
export type OrderFormData = z.infer<typeof orderFormSchema>