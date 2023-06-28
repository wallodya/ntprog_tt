from __future__ import annotations

from typing import TYPE_CHECKING
from fastapi import WebSocket
from logging import getLogger
from app.models.market_subscription import MarketSubscription

from app.models.quote import Quote

from app.schemas import server_messages

from app.schemas import base
from app.models.instrument import Instrument


class NotificationService:
    """
        NotificationService class is used to notify connected clients
        about quote updates via WebSocket (by sending MarketUpdate messages).

        In normal use case use it like a Command by instantiating, passing server instance
        and instrument object and calling notify method. This way it'll send notification to all
        connected clients who subscribed to updates of specified instrument.

        Aside from that you can use static methods "notify_for_all_subscriptions"
        and "notify_for_new_subscription" to send MarketUpdate message's to only one client
    """

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
            await self.__check_subscriptions(connection)

        self.logger.info(
            f"""
                Connected clients were notified about
                '{self.instrument.name}' quotes update
            """
        )

    async def __check_subscriptions(self, connection: base.Connection) -> None:
        for subscription in connection.subscriptions:
            if subscription.instrument.instrument_id == self.instrument.instrument_id:
                await self.__notify_client(subscription, connection)
                break
        return

    async def __notify_client(
        self,
        subscription: base.MarketSubscriptionModel,
        connection: base.Connection
    ) -> None:

        if not self.quotes:
            await self.__get_quotes()

        message = self.__get_message(subscription.id)

        await self.__send_notification(connection.socket, message)

    async def __send_notification(
            self,
            socket: WebSocket,
            message: server_messages.MarketDataUpdate
    ) -> None:

        await self.server.send(message, socket)

    async def __get_quotes(self) -> None:

        quotes = await Quote.objects.prefetch_related(
            [Quote.offer, Quote.bid]
        ).filter(
            instrument=self.instrument.instrument_id
        ).all()

        self.quotes = list(
            map(lambda q: NotificationService.extract_quote_data(q), quotes)
        )

    def __get_message(self, subscription_id: int) -> server_messages.MarketDataUpdate:

        if not self.quotes:
            raise Exception(
                "Can't construct Market update message until quotes were obtained"
            )

        return server_messages.MarketDataUpdate(
            subscription_id=subscription_id,
            instrument=base.InstrumentData(
                name=self.instrument.name,
                instrument_id=self.instrument.instrument_id,
                buy_position=self.instrument.buy_position,
                sell_position=self.instrument.sell_position
            ),
            quotes=self.quotes
        )

    @staticmethod
    def extract_quote_data(quote: Quote) -> base.QuoteData:

        return {
            "bid": quote.bid.price if quote.bid else 0,
            "offer": quote.offer.price if quote.offer else 0,
            "bid_amount": quote.bid.amount if quote.bid else 0,
            "offer_amount": quote.offer.amount if quote.offer else 0,
            "timestamp": quote.timestamp
        }

    @staticmethod
    async def notify_for_all_subscriptions(
        server: NTProServer, connection: base.Connection
    ) -> None:
        """
            Use this method to send MarketUpdates to a single client
            for every subscription it has.

            For example, use it when client just connected, so it
            receives all market data for its subscriptions right away.
        """
        for subscription in connection.subscriptions:
            quotes = await Quote.objects.prefetch_related(
                [Quote.offer, Quote.bid]
            ).filter(
                instrument=subscription.instrument.instrument_id
            ).all()

            quotes = list(
                map(lambda q: NotificationService.extract_quote_data(q), quotes)
            )

            message = server_messages.MarketDataUpdate(
                subscription_id=subscription.id,
                instrument=base.InstrumentData(
                    name=subscription.instrument.name,
                    instrument_id=subscription.instrument.instrument_id,
                    buy_position=subscription.instrument.buy_position,
                    sell_position=subscription.instrument.sell_position
                ),
                quotes=quotes
            )

            await server.send(message, connection.socket)

        return

    @staticmethod
    async def notify_for_new_subscription(server: NTProServer, socket: WebSocket, subscription: MarketSubscription):
        """
            Use this to send MarketUpdate to client after he created new subscription.
            Sends current quote's of the instrument specified in subscription object.
        """

        quotes = await Quote.objects.prefetch_related(
            [Quote.offer, Quote.bid]
        ).filter(
            instrument=subscription.instrument.instrument_id
        ).all()

        quotes = list(
            map(lambda q: NotificationService.extract_quote_data(q), quotes)
        )

        message = server_messages.MarketDataUpdate(
            subscription_id=subscription.id,
            instrument=base.InstrumentData(
                name=subscription.instrument.name,
                instrument_id=subscription.instrument.instrument_id,
                buy_position=subscription.instrument.buy_position,
                sell_position=subscription.instrument.sell_position
            ),
            quotes=quotes
        )

        await server.send(message, socket)
        return
    