from __future__ import annotations

import abc
from typing import TypeVar
from fastapi import WebSocket

import pydantic

from app.utils.enums import ClientMessageType, OrderStatus, ServerMessageType


def snake_to_camel(snake_str: str) -> str:
    if snake_str == "":
        return snake_str

    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class OrderData(pydantic.BaseModel):

    class Config:
        schema_extra = {
            "example": {
                "order_id": "some-unique-order-id",
                "instrument": "USD/RUB",
                "user_id": "some-unique-user-id",
                "side": 1,
                "status": OrderStatus.active,
                "amount": 100,
                "price": 67.45,
                "created_at": 1687171183841,
                "updated_at": 1687171183841,
            }
        }
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
        schema_extra={
            "example": {
                "name": "USD/RUB",
                "instrument_id": 6,
                "buy_position": 134_032.98,
                "sell_position": 145_321.56,
            }
        }
    name: str
    instrument_id: int
    buy_position: float
    sell_position: float


class UserDataIn(pydantic.BaseModel):
    class Config:
        schema_extra={
            "example": {
                "login": "User1",
                "password": "1234"
            }
        }

    login: str
    password: str

    @pydantic.validator("login")
    def validate_login(cls, v):
        if len(v) < 4 or len(v) > 20:
            raise pydantic.ValidationError("Login must be at least 4 letters long")
        return v

    @pydantic.validator("password")
    def validate_password(cls, v):
        if len(v) < 4 or len(v) > 20:
            raise pydantic.ValidationError("Login must be at least 4 letters long")
        return v


class MarketSubscriptionModel(pydantic.BaseModel):
    class Config:
        orm_mode = True
    id: int
    instrument: InstrumentData


class UserData(pydantic.BaseModel):
    class Config:
        orm_mode=True
        schema_extra={
            "example": {
                "uuid": "some-unique-user-id",
                "login": "User1",
                "created_at": 1687171183841
            }
        }
    uuid: str
    login: str
    created_at: int
    subscriptions: list[MarketSubscriptionModel]


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
    timestamp: int


MessageT = TypeVar('MessageT', bound=Message)
