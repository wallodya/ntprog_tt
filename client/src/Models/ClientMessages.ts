import { Envelope, Instrument } from "./Base"
import { ClientMessageType, OrderSide } from "types/Enums"
import Decimal from "decimal.js"

export type ClientEnvelope =
	| SubscribeMarketDataEnvelope
	| UnsubscribeMarketDataEnvelope
	| PlaceOrderEnvelope
	| CancelOrderEnvelope

export interface SubscribeMarketData {
    instrument: Instrument["instrumentId"]
}

export interface SubscribeMarketDataEnvelope extends Envelope {
    messageType: ClientMessageType.subscribeMarketData,
    message: SubscribeMarketData
}

export interface UnsubscribeMarketData {
    subscriptionId: string
}

export interface UnsubscribeMarketDataEnvelope extends Envelope {
    messageType: ClientMessageType.unsubscribeMarketData,
    message: UnsubscribeMarketData
}

export interface PlaceOrder {
    instrument: Instrument["instrumentId"]
	side: OrderSide
	amount: Decimal
	price: Decimal
}
export interface PlaceOrderEnvelope extends Envelope {
    messageType: ClientMessageType.placeOrder,
    message: PlaceOrder
}

export interface CancelOrder {
    orderId: string
}
export interface CancelOrderEnvelope extends Envelope {
    messageType: ClientMessageType.cancelOrder,
    message: CancelOrder
}
