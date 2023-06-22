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
			console.debug("Closed connection to socket on ", this._url)
		}

		this.connection.onerror = () => {
			this.connection = undefined
			console.debug("WSConnector failed to connect to ", this._url)
		}

		this.connection.onopen = () => {
			console.debug("Connected to socket on ", this._url)
		}

		this.connection.onmessage = event => {
            const envelope = this._validate(event.data)
			if (envelope) {
                this._callMessageHandler(envelope)
                return
            }
            console.warn("Recieved message is not valid: ", event.data)
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
				instrument_id: instrument,
			},
		})
	}

	unsubscribeMarketData(subscriptionId: number) {
		this.send({
			messageType: ClientMessageType.unsubscribeMarketData,
			message: {
				subscription_id: subscriptionId,
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
				order_id: orderId,
			},
		})
	}

    private _validate(message: string) {
        return this._validator.validate(message)
    }

	private _callMessageHandler(envelope: ServerEnvelope) {
        console.debug(
			`>>>Recieved envelope. Type: ${envelope.messageType}. Message:`, envelope.message
		)
		switch (envelope.messageType) {
			case ServerMessageType.success: {
                if (
					typeof envelope.message.info === "object" &&
					"subscription_id" in envelope.message.info
				) {
					toast.success(`
                        Subscribed (id: 
                            ${envelope.message.info.subscription_id}
                        )
                    `)
				}
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
					`market-update`,
					envelope.message
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
