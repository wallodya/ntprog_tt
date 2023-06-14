import { ClientEnvelope, PlaceOrder } from "models/ClientMessages"
import { ServerEnvelope } from "models/ServerMessages"
import { toast } from "react-toastify"
import { ClientMessageType, ServerMessageType } from "types/Enums"
import {
    ServerEnvelopeUnsafe,
	errorInfoMessageSchema,
	executionReportMessageSchema,
	marketDataUpdateMessageSchema,
	serverMessageSchema,
	successInfoMessageSchema,
} from "utils/validation/server-message.schema"

export default class WSConnector {
	connection: WebSocket | undefined
	private _url: string

	constructor() {
		this.connection = undefined
		this._url = this.serverURL
	}

	connect() {
		this.connection = new WebSocket(this._url)
		this.connection.onclose = () => {
			this.connection = undefined
			console.log("Closed connection to socket on ", this._url)
		}

		this.connection.onerror = () => {
			this.connection = undefined
			console.log("WSConnector failed to connect to ", this._url)
		}

		this.connection.onopen = () => {
			console.log("Connected to socket on ", this._url)
		}

		this.connection.onmessage = event => {
			this.handleServerMessage(event.data)
		}
	}

	disconnect() {
		if (!this.connection) {
			return
		}
		this.connection?.close()
	}

	send(message: ClientEnvelope) {
		this.connection?.send(JSON.stringify(message))
	}

	subscribeMarketData(instrument: number) {
		this.send({
			messageType: ClientMessageType.subscribeMarketData,
			message: {
				instrument,
			},
		})
	}

	unsubscribeMarketData(subscriptionId: string) {
		this.send({
			messageType: ClientMessageType.unsubscribeMarketData,
			message: {
				subscriptionId,
			},
		})
	}

	placeOrder({ instrument, side, amount, price }: PlaceOrder) {
		this.send({
			messageType: ClientMessageType.placeOrder,
			message: {
				instrument,
				side,
				amount,
				price,
			},
		})
	}

	cancelOrder(orderId: string) {
		this.send({
			messageType: ClientMessageType.cancelOrder,
			message: {
				orderId,
			},
		})
	}

	private handleServerMessage(message: string) {
		const data = this.validateServerEnvelope(JSON.parse(message))

		if (!data) {
			return
		}

        if (this.validateServerMessage(data)) {
            return
        }

		this.callMessageHandler(data as ServerEnvelope)
	}

	private validateServerEnvelope(obj: object) {
		const msg = serverMessageSchema.safeParse(obj)

		if (!msg.success) {
			return null
		}

		return msg.data
	}

    private validateServerMessage(envelope: ServerEnvelopeUnsafe) {
        let isMessageValid: boolean
		switch (envelope.messageType) {
			case ServerMessageType.success: {
				isMessageValid = successInfoMessageSchema.safeParse(
					envelope.message
				).success
				break
			}
			case ServerMessageType.error: {
				isMessageValid = errorInfoMessageSchema.safeParse(envelope.message).success
				break
			}
			case ServerMessageType.executionReport: {
				isMessageValid = executionReportMessageSchema.safeParse(
					envelope.message
				).success
				break
			}
			case ServerMessageType.marketDataUpdate: {
				isMessageValid = marketDataUpdateMessageSchema.safeParse(
					envelope.message
				).success
				break
			}
            default: {
                isMessageValid = false
            }
		}
        return isMessageValid
    }

	private callMessageHandler(envelope: ServerEnvelope) {
		switch (envelope.messageType) {
			case ServerMessageType.success: {
                toast.success(envelope.message.info)
                return
            }
            case ServerMessageType.error: {
                toast.error(envelope.message.reason)
                return
            }
			case ServerMessageType.executionReport: {
                toast.info(
					`Status for order ${envelope.message.orderId} changed to ${envelope.message.orderStatus}`
				)
                return
            }
			case ServerMessageType.marketDataUpdate: {
                return
            }
		}
	}

	private get serverURL() {
		const env = process.env.NODE_ENV
		if (!env) {
			throw new Error("NODE_ENV enviroment variable is not present")
		}

		if (env === "test") {
			return "ws://127.0.0.1:1234/"
		}

		if (!process.env.REACT_APP_SERVER_WS_URL) {
			throw new Error("Env. variable for server socket url is not set")
		}

		return process.env.REACT_APP_SERVER_WS_URL
	}
}
