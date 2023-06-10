import { Envelope, Message } from "@models/Base"
import { ClientMessageType, Instrument, OrderSide } from "types/Enums"
import Decimal from "decimal.js"

export interface ClientEnvelope extends Envelope {
	messageType: ClientMessageType
}

export interface ClientMessage extends Message {}

export interface SubscribeMarketData extends ClientMessage {
	instrument: Instrument
}

export interface UnsubscribeMarketData extends ClientMessage {
	subscriptionId: string
}

export interface PlaceOrder extends ClientMessage {
	instrument: Instrument
	side: OrderSide
	amount: Decimal
	price: Decimal
}
