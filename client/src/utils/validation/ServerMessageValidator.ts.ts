import { ServerEnvelope } from "models/ServerMessages"
import { ServerMessageType } from "types/Enums"
import {
	ServerEnvelopeUnsafe,
	errorInfoMessageSchema,
	executionReportMessageSchema,
	marketDataUpdateMessageSchema,
	serverMessageSchema,
	successInfoMessageSchema,
} from "utils/validation/server-message.schema"

export class ServerMessageValidator {
	validate(message: string) {
		const serverData = this.validateServerEnvelope(JSON.parse(message))

		if (!serverData) {
			return null
		}

		const messageData = this.validateServerMessage(serverData)

		if (!messageData) {
			return null
		}

		return messageData
	}

	private validateServerEnvelope(obj: object) {
		const envelope = serverMessageSchema.safeParse(obj)

		if (!envelope.success) {
			return null
		}

		return envelope.data
	}

	private validateServerMessage(
		envelope: ServerEnvelopeUnsafe
	): ServerEnvelope | null {
		let msg: { success: boolean; data?: object } = {
			success: false,
			data: {},
		}
		switch (envelope.messageType) {
			case ServerMessageType.success: {
				msg = successInfoMessageSchema.safeParse(envelope.message)
				break
			}
			case ServerMessageType.error: {
				msg = errorInfoMessageSchema.safeParse(envelope.message)
				break
			}
			case ServerMessageType.executionReport: {
				msg = executionReportMessageSchema.safeParse(envelope.message)
				break
			}
			case ServerMessageType.marketDataUpdate: {
				msg = marketDataUpdateMessageSchema.safeParse(envelope.message)
                console.debug("msg in validator: ", envelope.message)
				break
			}
		}

		if (msg.success) {
			envelope.message = msg.data
            return envelope
		}

        return null
	}
}
