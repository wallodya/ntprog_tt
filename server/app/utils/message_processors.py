from __future__ import annotations

from typing import TYPE_CHECKING

import ormar

from app.models.instrument import Instrument
from app.models.market_subscription import MarketSubscription
from app.models.order import Order


if TYPE_CHECKING:
    import fastapi

    from app.schemas import client_messages
    from app.utils.ntpro_server import NTProServer


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
        message: client_messages.PlaceOrder,
):
    from app.schemas import server_messages

    print("place order processor")

    # TODO ...

    return server_messages.SuccessInfo(info="Order is placed")
