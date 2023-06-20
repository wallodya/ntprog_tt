import Decimal from "decimal.js";
import { z } from "zod";

const instrumentSchema = z.object({
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

export const instrumentsDataSchema = z.array(instrumentSchema)

export default instrumentSchema