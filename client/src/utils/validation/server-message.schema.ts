import Decimal from "decimal.js"
import { ServerMessageType } from "types/Enums"
import { z } from "zod"

const serverMessageTypes = Object.values(ServerMessageType).filter(
	Number.isInteger
)

export const serverMessageSchema = z
	.object({
		message_type: z.number().refine(serverMessageTypes.includes),
		message: z.object({}),
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
	info: z.string(),
})

export const executionReportMessageSchema = z
	.object({
		order_id: z.string(),
		order_status: z.string(),
	})
	.transform(data => ({
		orderId: data.order_id,
		orderStatus: data.order_status,
	}))

export const marketDataUpdateMessageSchema = z
	.object({
		subscription_id: z.string(),
		instrument: z.string(),
		quotes: z.array(
			z
				.object({
					bid: z.number().transform(num => new Decimal(num)),
					offer: z.number().transform(num => new Decimal(num)),
					min_amount: z.number().transform(num => new Decimal(num)),
					max_amount: z.number().transform(num => new Decimal(num)),
				})
				.transform(data => ({
					bid: data.bid,
                    offer: data.offer,
					minAmount: data.min_amount,
					maxAmount: data.max_amount,
				}))
		),
	})
	.transform(data => ({
		subcriptionId: data.subscription_id,
		instrument: data.instrument,
        quotes: data.quotes
	}))
