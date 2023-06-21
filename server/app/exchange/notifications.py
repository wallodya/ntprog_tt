from __future__ import annotations

from typing import TYPE_CHECKING
from fastapi import WebSocket
from logging import getLogger

from app.models.quote import Quote

from app.schemas import server_messages

from app.schemas import base
from app.models.instrument import Instrument


class NotificationService():

    if TYPE_CHECKING:
        from app.utils.ntpro_server import NTProServer

    def __init__(self, server: NTProServer, instrument: Instrument) -> None:
        self.server = server
        self.instrument = instrument
        self.quotes = None

        self.logger = getLogger("Root.NotificationService")
        return
    
    async def notify(self) -> None:
        self.logger.info(
            f"Notifying about '{self.instrument.name}' quote updates"
        )
        for client, connection in self.server.connections.items():
            await self.check_subscriptions(connection)

        self.logger.info(
            f"Connected clients were notified about '{self.instrument.name}' quotes update"
        )

    async def check_subscriptions(self, connection: base.Connection) -> bool:
        for subscription in connection.subscriptions:
            if subscription.instrument.instrument_id == self.instrument.instrument_id:
                await self.notify_client(subscription, connection)
                break

        return
    
    async def notify_client(
            self, 
            subscription: base.MarketSubscriptionModel,
            connection: base.Connection
        ) -> None:

        if not self.quotes:
            await self.get_quotes()

        message = self.get_message(subscription.id)

        await self.send_notification(connection.socket, message)

    async def send_notification(
            self,
            socket: WebSocket,
            message: server_messages.MarketDataUpdate
    ) -> None:
        
        await self.server.send(message, socket)

    async def get_quotes(self) -> None:

        quotes = await Quote.objects.prefetch_related(
            [Quote.offer, Quote.bid]
        ).filter(
            instrument=self.instrument
        ).all()

        self.quotes = list(
            map(lambda q: self.extract_quote_data(q), quotes)
        )

    def extract_quote_data(self, quote: Quote) -> base.QuoteData:

        return {
            "bid": quote.bid.price,
            "offer": quote.offer.price,
            "bid_amount": quote.bid.amount,
            "offer_amount": quote.offer.amount
        }
    
    def get_message(self, subscription_id: int) -> server_messages.MarketDataUpdate:

        if not self.quotes:
            raise Exception(
                "Can't construct Market update message until qoutes were obtained"
            )
        
        return server_messages.MarketDataUpdate(
            subscription_id=subscription_id,
            instrument=base.InstrumentData(
                name=self.instrument.name,
                instrument_id=self.instrument.instrument_id
            ),
            quotes=self.quotes
    )
