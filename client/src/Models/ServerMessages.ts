import { OrderStatus, ServerMessageType } from "types/Enums"
import { Envelope, Message, Quote } from "./Base"

export type ServerEnvelope =
	| ErrorInfoEnvelope
	| SuccessInfoEnvelope
	| ExecutionReportEnvelope
	| MarketDataUpdateEnvelope

export interface ServerMessage extends Message {}

export interface ErrorInfo extends ServerMessage {
	reason: string
}

export interface ErrorInfoEnvelope extends Envelope {
	messageType: ServerMessageType.error
	message: ErrorInfo
}

export interface SuccessInfo extends ServerMessage {
    info: string
}

export interface SuccessInfoEnvelope extends Envelope {
	messageType: ServerMessageType.success
	message: SuccessInfo
}

export interface ExecutionReport extends ServerMessage {
	orderId: string
	orderStatus: OrderStatus
}

export interface ExecutionReportEnvelope extends Envelope {
	messageType: ServerMessageType.executionReport
	message: ExecutionReport
}

export interface MarketDataUpdate extends ServerMessage {
	subscriptionId: string
	instrument: string
	quotes: [Quote]
}

export interface MarketDataUpdateEnvelope extends Envelope {
	messageType: ServerMessageType.marketDataUpdate
	message: MarketDataUpdate
}
