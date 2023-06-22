import Decimal from "decimal.js";
import { OrderStatus, OrderSide } from "types/Enums";
import { z } from "zod";

const orderSideValues = Object.values(OrderSide).filter(Number.isInteger)
const orderStatusValues = Object.values(OrderStatus).filter(Number.isInteger)


const orderSchema = z.object({
    order_id: z.string(),
    created_at: z.number(),
    updated_at: z.number(),
    status: z.number().refine(num => orderStatusValues.includes(num)),
    side: z.number().refine(num => orderSideValues.includes(num)),
    price: z.number().min(0).transform(num => new Decimal(num)),
    amount: z.number().min(0),
    instrument: z.string(),
    user_id: z.string()
})
.transform(data => ({
    orderId: data.order_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    status: data.status,
    side: data.side,
    price: data.price,
    amount: data.amount,
    instrument: data.instrument,
    userId: data.user_id
}))

export const ordersDataSchema = z.array(orderSchema)

export default orderSchema