import { ClientEnvelope, PlaceOrder } from "models/ClientMessages"
import { ServerEnvelope } from "models/ServerMessages"
import { ClientMessageType, ServerMessageType } from "types/Enums"

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
            console.log("Error while connecting to socket on ", this._url)
        }

		this.connection.onopen = () => {
            console.log("Connected to socket on ", this._url)
        }

		this.connection.onmessage = event => {
			const message: ServerEnvelope = JSON.parse(event.data)
			switch (message.messageType) {
				case ServerMessageType.success:
					break
				case ServerMessageType.error:
					break
				case ServerMessageType.executionReport:
					break
				case ServerMessageType.marketDataUpdate:
					break
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
                orderId
            }
        })
    }

	get serverURL() {
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
