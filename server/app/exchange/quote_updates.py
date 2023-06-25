from __future__ import annotations

import time
import logging
from typing import TYPE_CHECKING

from app.models.quote import Quote
from app.utils.enums import OrderSide   
from .notifications import NotificationService

if TYPE_CHECKING:
    from app.utils.ntpro_server import NTProServer
    from app.models.order import Order


class UpdateQuotes:

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

        self.logger = logging.getLogger("Root.UpdateQuotes")
        self.logger.setLevel(logging.INFO)
        return

    async def execute(self) -> None:
        self.logger.info(
            f"Executing <UpdateQuotes> command for order: {self.new_order.order_id}"
        )
        await self.set_current_quote()

        if self.current_quote:
            self.set_current_prices()

        bid_outdated, offer_outdated = self.quote_needs_update()

        if bid_outdated:
            self.logger.info(
                f"""
                    Bid price ({self.current_bid_price}) is outdated 
                    for '{self.instrument.name}' instrument's quote.\n
                    New price: {self.new_price}
                """
            )
            await self.create_new_quote(
                self.new_order,
                self.current_quote.offer if self.current_quote else None
            )
            await self.notify_subscribers()
            return
    
        if offer_outdated:
            self.logger.info(
                f"""
                    Offer price ({self.current_offer_price}) is outdated 
                    for '{self.instrument.name} instrument's quote'.\n
                    New price: {self.new_price}
                """
            )
            await self.create_new_quote(
                self.current_quote.bid if self.current_quote else None,
                self.new_order
            )
            await self.notify_subscribers()
            return

        self.logger.info(
            f"""
                Quotes for instrument {self.instrument.name}
                don't need to be updated
            """
        )
        return

    def set_current_prices(self) -> None:
        if self.current_quote.bid:
            self.current_bid_price = self.current_quote.bid.price
        else:
            self.current_bid_price = 0

        if self.current_quote.offer:
            self.current_offer_price = self.current_quote.offer.price
        else:
            self.current_offer_price = 0

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
    
    async def create_new_quote(self, bid: Order | None, offer: Order | None) -> Quote:
        self.logger.debug(
            f"""
                Creating new quote for instrument '{self.instrument.name}'
            """
        )
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
        return not self.current_quote  or self.new_price > self.current_bid_price 
    
    def offer_needs_update(self) -> bool:
        return not self.current_quote or self.new_price < self.current_offer_price 

    async def notify_subscribers(self) -> None:
        await self.notification_service.notify()
        return
