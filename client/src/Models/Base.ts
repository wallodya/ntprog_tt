import Decimal from "decimal.js"
import { ClientMessageType, ServerMessageType } from "types/Enums"

export interface Envelope {
	messageType: ClientMessageType | ServerMessageType
	message: object
}

export interface Message {}

export interface Quote {
	bid: Decimal
	offer: Decimal
	minAmount: Decimal
	maxAmount: Decimal
}

export interface Instrument {
    instrumentId: number,
    name: string,
}

export interface MarketSubscription {
    subscriptionId: string,
    instrument: Instrument,
}
