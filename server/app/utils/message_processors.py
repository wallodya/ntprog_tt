from __future__ import annotations
import asyncio
import time

from typing import TYPE_CHECKING
from uuid import uuid4

import ormar

from app.models.instrument import Instrument
from app.models.market_subscription import MarketSubscription
from app.models.order import Order
from app.schemas.server_messages import ExecutionReport
from app.utils.enums import OrderStatus

from app.exchange.update_quotes import MarketUpdateService


if TYPE_CHECKING:
    import fastapi

    from app.schemas import client_messages
    from app.utils.ntpro_server import NTProServer


async def get_insturment_by_id(id: int) -> Instrument:
    from app.schemas import server_messages

    try:
        instrument = await Instrument.objects.get(instrument_id=id)
    except ormar.NoMatch:
        return server_messages.ErrorInfo(
            reason=f"Instrument with id {id} does not exists"
        )
    
    return instrument

async def subscribe_market_data_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.SubscribeMarketData,
):
    from app.schemas import server_messages

    try:
        instrument = await Instrument.objects.get(instrument_id=message.instrument_id)
    except ormar.NoMatch:
        return server_messages.ErrorInfo(
            reason=f"Instrument with id {message.instrument_id} does not exists"
        )

    subscription, _ = await MarketSubscription.objects.get_or_create(
        instrument=instrument,
        user=websocket.state.user
    )

    return server_messages.SuccessInfo(info={
        "subscription_id": subscription.id
    })


async def unsubscribe_market_data_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.UnsubscribeMarketData,
):
    from app.schemas import server_messages

    await MarketSubscription.objects.delete(id=message.subscription_id)

    return server_messages.SuccessInfo(info="Unsubscribed")


async def place_order_processor(
        server: NTProServer,
        websocket: fastapi.WebSocket,
        message: client_messages.PlaceOrder
):
    from app.schemas import server_messages

    instrument = await get_insturment_by_id(message.instrument)

    order = await Order.objects.create(
        order_id=str(uuid4()),
        instrument=instrument,
        user=websocket.state.user,
        side=message.side,
        status=OrderStatus.active,
        amount=message.amount,
        price=message.price,
        created_at=time.time() * 1000,
        updated_at=time.time() * 1000
    )

    await server.send(
        ExecutionReport(order_id=order.order_id,order_status=order.status),
        websocket
    )

    # asyncio.create_task(update_quotes(order, server))
    asyncio.create_task(MarketUpdateService(server, order).update_quotes())

    return server_messages.SuccessInfo(info="Order is placed")
