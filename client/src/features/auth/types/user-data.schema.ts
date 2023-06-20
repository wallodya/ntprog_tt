import Decimal from "decimal.js";
import { z } from "zod";

const userSchema = z.object({
	login: z.string(),
	uuid: z.string(),
	created_at: z.number(),
	subscriptions: z.array(
		z.object({
            id: z.number(),
            instrument: z.object({
                name: z.string(),
                instrument_id: z.number(),
                buy_position: z.number().transform(num => new Decimal(num)),
                sell_position: z.number().transform(num => new Decimal(num))
            })
            .transform(instrument => ({
                name: instrument.name,
                instrumentId: instrument.instrument_id,
                buyPosition: instrument.buy_position,
                sellPosition: instrument.sell_position
            }))
        })
        .transform(sub => ({
            subscriptionId: sub.id,
            instrument: sub.instrument
        }))
	),
}).transform(data => ({
    login: data.login,
    uuid: data.uuid,
    createdAt: data.created_at,
    subscriptions: data.subscriptions
}))

export type UserData = z.infer<typeof userSchema>

export default userSchema