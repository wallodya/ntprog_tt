from __future__ import annotations

import time
from typing import TYPE_CHECKING

from app.models.quote import Quote
from app.utils.enums import OrderSide   
from .notifications import NotificationService

if TYPE_CHECKING:
    from app.utils.ntpro_server import NTProServer
    from app.models.order import Order

class MarketUpdateService():

    def __init__(self, server: NTProServer, order: Order) -> None:

        self.server = server
        self.instrument = order.instrument
        self.new_order = order

        self.notification_service = NotificationService(server, order.instrument)

        self.side = order.side
        self.new_price = order.price

        self.current_quote = None
        self.current_bid_price = None
        self.current_offer_price = None

        return

    async def update_quotes(self) -> None:
        await self.set_current_quote()

        if not self.current_quote:
            return

        self.set_current_prices()

        bid_outdated, offer_outdated = self.quote_needs_update()

        if bid_outdated:
            await self.create_new_quote(self.new_order, self.current_quote.offer)
            await self.notify_subscribers()
            return
    
        if offer_outdated:
            await self.create_new_quote(self.current_quote.bid, self.new_order)
            await self.notify_subscribers()
            return

        return

    def set_current_prices(self) -> None:
        self.current_bid_price = self.current_quote.bid.price
        self.current_offer_price = self.current_quote.offer.price

        return

    async def set_current_quote(self) -> Quote | None:
        self.current_quote = await Quote.objects.prefetch_related(
            [Quote.instrument, Quote.offer, Quote.bid]
        ).filter(
            instrument=self.instrument
        ).order_by(
            "-timestamp"
        ).limit(
            1
        ).get_or_none()

        return
    
    async def create_new_quote(self, bid: Order, offer: Order) -> Quote:
        return await Quote.objects.create(
            bid=bid,
            offer=offer,
            instrument=self.instrument,
            timestamp=time.time() * 1000
        )
    
    def quote_needs_update(self) -> tuple[bool, bool]:

        if self.side == OrderSide.buy:
            return (self.bid_needs_update(), False)
        
        if self.side == OrderSide.sell:
            return (False, self.offer_needs_update())
    
    def bid_needs_update(self) -> bool:
        return self.new_price > self.current_bid_price
    
    def offer_needs_update(self) -> bool:
        return self.new_price < self.current_offer_price

    async def notify_subscribers(self) -> None:
        await self.notification_service.notify()
        return
