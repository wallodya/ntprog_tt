from __future__ import annotations
import asyncio
import random
import time
from typing import TYPE_CHECKING

from fastapi import WebSocket

from app.models.order import Order
from app.schemas.server_messages import ExecutionReport
from app.utils.enums import OrderSide, OrderStatus

if TYPE_CHECKING:
    from app.utils.ntpro_server import NTProServer


class ProcessOrder:

    def __init__(self, server: NTProServer, socket: WebSocket, order: Order):
        self.order = order
        self.side = order.side
        self.instrument = order.instrument

        self.server = server
        self.socket = socket

        self.random_status = None

        return

    async def mock_processing(self) -> None:

        await asyncio.sleep(random.randint(2, 30))

        self.set_random_status()

        await self.manage_new_status()

        return
    
    async def manage_new_status(self) -> None:
        if self.random_status == OrderStatus.filled:
            await self.fill_order()
            return

        if self.random_status == OrderStatus.rejected:
            await self.reject_order()
            return
        
        return
    
    async def fill_order(self) -> None:

        await self.update_status(OrderStatus.filled)

        await self.server.send(
            ExecutionReport(order_id=self.order.order_id,order_status=OrderStatus.filled),
            self.socket
        )

        await self.update_position()

        return

    async def reject_order(self) -> None:

        await self.update_status(OrderStatus.rejected)

        await self.server.send(
            ExecutionReport(order_id=self.order.order_id,order_status=OrderStatus.rejected),
            self.socket
        )

        return

    async def update_status(self, status) -> None:
        await Order.objects.filter(
            order_id=self.order.order_id
        ).update(
            status=status,
            updated_at=time.time() * 1000
        )

        return
    
    def set_random_status(self) -> None:
        self.random_status = random.choice(list(OrderStatus))

    async def update_position(self) -> None:

        if self.side == OrderSide.buy:
            await self.update_buy_position()

        if self.side == OrderSide.sell:
            await self.update_sell_position()
        
        return
    
    async def update_buy_position(self) -> None:
        new_position = self.get_new_position(self.instrument.buy_position)

        await self.instrument.update(
            buy_position=new_position
        )

        return

    async def update_sell_position(self) -> None:
        new_position = self.get_new_position(self.instrument.sell_position)

        await self.instrument.update(
            sell_position=new_position
        )

        return

    
    def get_new_position(self, current_volume) -> float:
        return current_volume + (self.order.price * self.order.amount)