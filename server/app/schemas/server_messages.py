from __future__ import annotations

from typing import List, TypeVar

import bidict as bidict

from app.utils import enums
from app.schemas.base import Envelope, InstrumentData, Message, QuoteData


class ServerMessage(Message):
    def get_type(self: ServerMessageT) -> enums.ServerMessageType:
        return _SERVER_MESSAGE_TYPE_BY_CLASS[self.__class__]


class ErrorInfo(ServerMessage):
    reason: str


class SuccessInfo(ServerMessage):
    info: str | dict


class ExecutionReport(ServerMessage):
    order_id: str
    order_status: enums.OrderStatus


class MarketDataUpdate(ServerMessage):
    subscription_id: int
    instrument: InstrumentData
    quotes: List[QuoteData]


class ServerEnvelope(Envelope):
    message_type: enums.ServerMessageType

    def get_parsed_message(self):
        return _SERVER_MESSAGE_TYPE_BY_CLASS.inverse[self.message_type].parse_obj(self.message)


_SERVER_MESSAGE_TYPE_BY_CLASS = bidict.bidict({
    SuccessInfo: enums.ServerMessageType.success,
    ErrorInfo: enums.ServerMessageType.error,
    ExecutionReport: enums.ServerMessageType.execution_report,
    MarketDataUpdate: enums.ServerMessageType.market_data_update,
})
ServerMessageT = TypeVar('ServerMessageT', bound=ServerMessage)
