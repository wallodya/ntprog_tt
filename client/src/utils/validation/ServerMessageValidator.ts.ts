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
        
        if (!this.validateServerMessage(serverData)) {
            return null
        }
        
		return serverData
	}
    
	private validateServerEnvelope(obj: object) {
		const envelope = serverMessageSchema.safeParse(obj)

		if (!envelope.success) {
			return null
		}

		return envelope.data
	}

    private validateServerMessage(envelope: ServerEnvelopeUnsafe): envelope is ServerEnvelope {
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
}