import Decimal from "decimal.js";
import instrumentSchema from "features/instruments/instrument.schema";
import { z } from "zod";

const instrumentLSSchema = z.object({
    name: z.string(),
    instrumentId: z.number(),
    buyPosition: z.string().transform(num => new Decimal(num)),
    sellPosition: z.string().transform(num => new Decimal(num))
})

export const subscriptionSchema = z.object({
	subscriptionId: z.number(),
	instrument: instrumentLSSchema,
	quotes: z.array(
		z.object({
			bid: z.string().transform(num => new Decimal(num)),
			offer: z.string().transform(num => new Decimal(num)),
			bidAmount: z.string().transform(num => new Decimal(num)),
			offerAmount: z.string().transform(num => new Decimal(num)),
			timestamp: z.number().max(Date.now()).min(0),
		})
	),
})

export const subscriptionArraySchema = z.array(subscriptionSchema)