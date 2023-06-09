import Decimal from "decimal.js"
import instrumentSchema from "features/instruments/instrument.schema"
import { OrderStatus, ServerMessageType } from "types/Enums"
import { z } from "zod"

const serverMessageTypes = Object.values(ServerMessageType).filter(
	Number.isInteger
)

const orderStutusValues = Object.values(OrderStatus).filter(Number.isInteger)

export const serverMessageSchema = z
	.object({
		message_type: z.number().refine(num => serverMessageTypes.includes(num)),
		message: z.any(),
	})
	.transform(data => ({
		messageType: data.message_type,
		message: data.message,
	}))

export type ServerEnvelopeUnsafe = z.infer<typeof serverMessageSchema> 

export const errorInfoMessageSchema = z.object({
	reason: z.string(),
})

export const successInfoMessageSchema = z.object({
	info: z.any(),
})

export const executionReportMessageSchema = z
	.object({
		order_id: z.string(),
		order_status: z.number().refine(num => orderStutusValues.includes(num)),
	})
	.transform(data => ({
		orderId: data.order_id,
		orderStatus: data.order_status,
	}))

export const marketDataUpdateMessageSchema = z
	.object({
		subscription_id: z.number(),
		instrument: instrumentSchema,
		quotes: z.array(
			z
				.object({
					bid: z.number().transform(num => new Decimal(num)),
					offer: z.number().transform(num => new Decimal(num)),
					bid_amount: z.number().transform(num => new Decimal(num)),
					offer_amount: z.number().transform(num => new Decimal(num)),
                    timestamp: z.number().max(Date.now()).min(0)
				})
				.transform(data => ({
					bid: data.bid,
                    offer: data.offer,
					bidAmount: data.bid_amount,
					offerAmount: data.offer_amount,
                    timestamp: data.timestamp
				}))
		),
	})
	.transform(data => ({
		subscriptionId: data.subscription_id,
		instrument: data.instrument,
        quotes: data.quotes
	}))
