import EventEmitter from "events"
import { ClientEnvelope, PlaceOrder } from "models/ClientMessages"
import { ServerEnvelope } from "models/ServerMessages"
import { toast } from "react-toastify"
import { ClientMessageType, ServerMessageType } from "types/Enums"
import { ServerMessageValidator } from "utils/validation/ServerMessageValidator.ts"

export default class WSConnector extends EventEmitter {
	connection: WebSocket | undefined
	private _url: string
    private _validator: ServerMessageValidator

	constructor() {
        super()
		this.connection = undefined
		this._url = this._serverURL
        this._validator = new ServerMessageValidator()
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
            const envelope = this._validate(event.data)
			if (envelope) {
                this._callMessageHandler(envelope)
            }
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

	unsubscribeMarketData(subscriptionId: number) {
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

    private _validate(message: string) {
        return this._validator.validate(message)
    }

	private _callMessageHandler(envelope: ServerEnvelope) {
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
                this.emit(
					`execution-report`,
					envelope.message
				)
                return
            }
			case ServerMessageType.marketDataUpdate: {
                this.emit(
					`market-update-${envelope.message.subscriptionId}`,
					envelope.message.quotes
				)
                return
            }
		}
	}

	private get _serverURL() {
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
