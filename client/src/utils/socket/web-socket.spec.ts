import WS from "jest-websocket-mock"
import WSClient from "./WSClient"
import {
	CancelOrderEnvelope,
	PlaceOrderEnvelope,
	SubscribeMarketDataEnvelope,
	UnsubscribeMarketDataEnvelope,
} from "models/ClientMessages"
import { ClientMessageType } from "types/Enums"
import Decimal from "decimal.js"

const MOCK_SERVER_WS_URL = "ws://127.0.0.1:1234/"

describe("WSConnector", () => {
	let socket: WSClient
	let server: WS

	beforeEach(async () => {
		socket = new WSClient()
		server = new WS(MOCK_SERVER_WS_URL)
	})

	afterEach(() => {
		if (socket.connection) {
			socket.disconnect()
		}
		WS.clean()
	})

	describe("instance", () => {
		test("should have valid _url property", () => {
			expect(socket["_url"]).toBeDefined()
			expect(socket["_url"]).toBe(MOCK_SERVER_WS_URL)
		})

		test("should have connection property", () => {
			expect(socket).toHaveProperty("connection")
			expect(socket.connection).toBeUndefined()
		})
	})

	describe("connect method", () => {
		test("should be defined", () => {
			expect(socket).toHaveProperty("connect")
			expect(socket.connect).toBeInstanceOf(Function)
		})

		test("should connect to the server", async () => {
			socket.connect()
			await server.connected

			expect(socket.connection).toBeDefined()
			expect(socket.connection).toBeInstanceOf(WebSocket)
		})
	})

	describe("send method", () => {
		test("should be defined", () => {
			expect(socket).toHaveProperty("send")
			expect(socket.send).toBeInstanceOf(Function)
		})

		test("should call send method on WebSocket", async () => {
			socket.connect()
			await server.connected

			const spySend = jest.spyOn(socket.connection as WebSocket, "send")

			const data: SubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.subscribeMarketData,
				message: {
					instrument_id: 1,
				},
			}
			socket.send(data)

			expect(spySend).toBeCalledTimes(1)
		})

		test("should send subscribe message to server", async () => {
			socket.connect()
			await server.connected

			const data: SubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.subscribeMarketData,
				message: {
					instrument_id: 1,
				},
			}
			socket.send(data)

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})

		test("should send unsubscribe message to server", async () => {
			socket.connect()
			await server.connected

			const data: UnsubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.unsubscribeMarketData,
				message: {
					subscription_id: 1,
				},
			}
			socket.send(data)

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})

		test("should send place order message to server", async () => {
			socket.connect()
			await server.connected

			const data: PlaceOrderEnvelope = {
				messageType: ClientMessageType.placeOrder,
				message: {
					instrument: 1,
					side: 1,
					amount: new Decimal(1),
					price: new Decimal(1),
				},
			}
			socket.send(data)

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})

		test("should send cancel order message to server", async () => {
			socket.connect()
			await server.connected

			const data: CancelOrderEnvelope = {
				messageType: ClientMessageType.cancelOrder,
				message: {
					order_id: "order-id",
				},
			}
			socket.send(data)

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})
	})

	describe("subscribeMarketData method", () => {
		test("should be defined", () => {
			expect(socket).toHaveProperty("subscribeMarketData")
			expect(socket.subscribeMarketData).toBeInstanceOf(Function)
		})

		test("should call send method with correct data", async () => {
			socket.connect()
			await server.connected

			const spyOnSend = jest.spyOn(socket, "send")

			const data: SubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.subscribeMarketData,
				message: {
					instrument_id: 1,
				},
			}
			socket.subscribeMarketData(1)

			expect(spyOnSend).toBeCalledTimes(1)
			expect(spyOnSend).toBeCalledWith(data)
		})

		test("should send subscribe message to the server", async () => {
			socket.connect()
			await server.connected

			const data: SubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.subscribeMarketData,
				message: {
					instrument_id: 1,
				},
			}
			socket.subscribeMarketData(1)

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})
	})

	describe("unsubscribeMarketData method", () => {
		test("should be defined", () => {
			expect(socket).toHaveProperty("unsubscribeMarketData")
			expect(socket.unsubscribeMarketData).toBeInstanceOf(Function)
		})

		test("should call send method with correct data", async () => {
			socket.connect()
			await server.connected

			const spyOnSend = jest.spyOn(socket, "send")

			const data: UnsubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.unsubscribeMarketData,
				message: {
					subscription_id: 1,
				},
			}
			socket.unsubscribeMarketData(1)

			expect(spyOnSend).toBeCalledTimes(1)
			expect(spyOnSend).toBeCalledWith(data)
		})

		test("should send unsubscribe message to the server", async () => {
			socket.connect()
			await server.connected

			const data: UnsubscribeMarketDataEnvelope = {
				messageType: ClientMessageType.unsubscribeMarketData,
				message: {
					subscription_id: 1,
				},
			}
			socket.unsubscribeMarketData(1)

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})
	})

	describe("placeOrder method", () => {
		test("should be defined", () => {
			expect(socket).toHaveProperty("placeOrder")
			expect(socket.placeOrder).toBeInstanceOf(Function)
		})

		test("should call send method with correct data", async () => {
			socket.connect()
			await server.connected

			const spyOnSend = jest.spyOn(socket, "send")

			const data: PlaceOrderEnvelope = {
				messageType: ClientMessageType.placeOrder,
				message: {
					instrument: 1,
					side: 1,
					amount: new Decimal(1),
					price: new Decimal(1),
				},
			}

			socket.placeOrder({
				instrument: 1,
				side: 1,
				amount: new Decimal(1),
				price: new Decimal(1),
			})

			expect(spyOnSend).toBeCalledTimes(1)
			expect(spyOnSend).toBeCalledWith(data)
		})

		test("should send place order message to the server", async () => {
			socket.connect()
			await server.connected

			const data: PlaceOrderEnvelope = {
				messageType: ClientMessageType.placeOrder,
				message: {
					instrument: 1,
					side: 1,
					amount: new Decimal(1),
					price: new Decimal(1),
				},
			}

			socket.placeOrder({
				instrument: 1,
				side: 1,
				amount: new Decimal(1),
				price: new Decimal(1),
			})

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})
	})

    describe("cancel order method", () => {
		test("should be defined", () => {
			expect(socket).toHaveProperty("cancelOrder")
			expect(socket.cancelOrder).toBeInstanceOf(Function)
		})

		test("should call send method with correct data", async () => {
			socket.connect()
			await server.connected

			const spyOnSend = jest.spyOn(socket, "send")

			const data: CancelOrderEnvelope = {
				messageType: ClientMessageType.cancelOrder,
				message: {
					order_id: "order-id",
				},
			}
			socket.cancelOrder("order-id")

			expect(spyOnSend).toBeCalledTimes(1)
			expect(spyOnSend).toBeCalledWith(data)
		})

		test("should send unsubscribe message to the server", async () => {
			socket.connect()
			await server.connected

            const data: CancelOrderEnvelope = {
				messageType: ClientMessageType.cancelOrder,
				message: {
					order_id: "order-id",
				},
			}
			socket.cancelOrder("order-id")

			await expect(server).toReceiveMessage(JSON.stringify(data))
		})
	})
})

describe("WSConnector connection", () => {
	let socket: WSClient
	let server: WS

	beforeEach(async () => {
		socket = new WSClient()
		server = new WS(MOCK_SERVER_WS_URL)
		socket.connect()
		await server.connected
	})

	afterEach(() => {
		if (socket.connection) {
			socket.disconnect()
		}
		WS.clean()
	})

	test("should be defined after connect method was called", async () => {
		expect(socket.connection).toBeDefined()
		expect(socket.connection).toBeInstanceOf(WebSocket)
	})

	test("should have onclose listener", async () => {
		expect(socket.connection?.onclose).toBeDefined()
		expect(socket.connection?.onclose).toBeInstanceOf(Function)
	})

	test("should have onopen listener", async () => {
		expect(socket.connection?.onopen).toBeDefined()
		expect(socket.connection?.onopen).toBeInstanceOf(Function)
	})

	test("should have onerror listener", async () => {
		expect(socket.connection?.onerror).toBeDefined()
		expect(socket.connection?.onerror).toBeInstanceOf(Function)
	})

	describe("onerror", () => {
		test("should fire error event", () => {
			const spyDispatch = jest.spyOn(
				socket.connection as WebSocket,
				"dispatchEvent"
			)
			server.error()

			expect(spyDispatch.mock.calls[0][0].type).toBe("error")
		})

		test("should fire close event", () => {
			const spyDispatch = jest.spyOn(
				socket.connection as WebSocket,
				"dispatchEvent"
			)
			server.error()

			expect(spyDispatch.mock.calls[1][0].type).toBe("close")
		})
		test("should close connection after error", () => {
			server.error()

			expect(socket.connection).toBeUndefined()
		})
	})

	test("should have onmessage listener", async () => {
		expect(socket.connection?.onmessage).toBeDefined()
		expect(socket.connection?.onmessage).toBeInstanceOf(Function)
	})

    describe("onmessage", () => {
        test("should recieve messages from server", () => {
            const spyDispatch = jest.spyOn(
				socket.connection as WebSocket,
				"dispatchEvent"
			)
            const data = JSON.stringify("hello")
            server.send(data)

            console.log(spyDispatch.mock.calls)
            expect(spyDispatch).toBeCalledTimes(1)
            expect(spyDispatch.mock.calls[0][0].type).toBe("message")
            expect((spyDispatch.mock.calls[0][0] as MessageEvent)["data"]).toBe(data)
        })
    })
})

describe("WS connector disconnect method", () => {
	const socket = new WSClient()

	test("should be defined", () => {
		expect(socket).toHaveProperty("disconnect")
		expect(socket.disconnect).toBeInstanceOf(Function)
	})

	test("should close connection", async () => {
		const server = new WS(MOCK_SERVER_WS_URL)
		socket.connect()
		await server.connected

		expect(socket.connection).toBeDefined()
		expect(socket.connection).toBeInstanceOf(WebSocket)

		const closeSpy = jest.spyOn(socket.connection as WebSocket, "close")

		socket.disconnect()
		expect(closeSpy).toBeCalledTimes(1)
		setTimeout(() => {
			expect(socket.connection).toBeUndefined()
		}, 100)
	})
})
