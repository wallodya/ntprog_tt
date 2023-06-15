import Decimal from "decimal.js"
import { ClientMessageType, ServerMessageType } from "types/Enums"

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

export interface Instrument {
    instrumentId: number,
    name: string,
}

export interface MarketSubscription {
    subscriptionId: string,
    instrument: Instrument,
}
