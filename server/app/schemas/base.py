from __future__ import annotations

import abc
from typing import TypeVar
from fastapi import WebSocket

import pydantic

from app.utils.enums import ClientMessageType, ServerMessageType


def snake_to_camel(snake_str: str) -> str:
    if snake_str == "":
        return snake_str

    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])\
    
class OrderData(pydantic.BaseModel):
    order_id: str
    instrument: str
    user_id: str
    side: int
    status: int
    amount: int
    price: float
    created_at: int
    updated_at: int

class InstrumentData(pydantic.BaseModel):
    class Config:
        orm_mode=True
    name: str
    instrument_id: int

class UserDataIn(pydantic.BaseModel):
    login: str
    password: str

class UserData(pydantic.BaseModel):
    class Config:
        orm_mode=True
    uuid: str
    login: str
    created_at: int

class Envelope(pydantic.BaseModel, abc.ABC):
    class Config:
        extra = pydantic.Extra.forbid
        alias_generator = snake_to_camel
        allow_population_by_field_name = True

    message_type: ClientMessageType | ServerMessageType
    message: dict

    @abc.abstractmethod
    def get_parsed_message(self): ...


class Message(pydantic.BaseModel, abc.ABC):
    class Config:
        frozen = True
        extra = pydantic.Extra.forbid

    @abc.abstractmethod
    def get_type(self): ...

class MarketSubscriptionModel(pydantic.BaseModel):
    class Config:
        orm_mode=True
    id: int
    instrument: InstrumentData

class Connection(pydantic.BaseModel):
    class Config:
        arbitrary_types_allowed = True
    socket: WebSocket
    subscriptions: list[MarketSubscriptionModel] = []


class QuoteData(pydantic.BaseModel):
    bid: float
    offer: float
    bid_amount: int
    offer_amount: int


MessageT = TypeVar('MessageT', bound=Message)
