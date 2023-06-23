import Decimal from "decimal.js"
import { ClientMessageType, OrderSide, OrderStatus, ServerMessageType } from "types/Enums"

export interface Envelope {
	messageType: ClientMessageType | ServerMessageType
	message: object
}

export interface Message {}

export interface Quote {
    timestamp: number
	bid: Decimal
	offer: Decimal
	bidAmount: Decimal
	offerAmount: Decimal
}

export type Order = {
	orderId: string
	createdAt: number
	updatedAt: number
	status: OrderStatus
	side: OrderSide
	price: Decimal
	amount: number
	instrument: string
    userId: string
}

export interface Instrument {
    instrumentId: number,
    name: string,
    buyPosition: Decimal,
    sellPosition: Decimal
}

export interface MarketSubscription {
    subscriptionId: number,
    instrument: Instrument,
}
