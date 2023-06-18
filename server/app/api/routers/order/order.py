from typing import Annotated, List, Union
from fastapi import APIRouter, Query
from ormar import UUID

from app.models.order import Order
from app.schemas.server_messages import OrderData

from app.db.create_data import create_orders

order_router = APIRouter(prefix="/orders")

def flatten_order_data(order: Order) -> OrderData:
    return {
            "order_id": order.order_id,
            "side": order.side,
            "amount": order.amount,
            "price": order.price,
            "status": order.status,
            "user": order.user.uuid,
            "isntrument": order.instrument.name,
    }

@order_router.get("/")
async def get_orders(page: Annotated[Union[int, None], Query()] = 1):

    orders = await Order.objects.paginate(
        1 if page <= 0 else page
    ).prefetch_related(
        [Order.user, Order.instrument]
    ).fields(
        ["order_id", "side", "amount", "status", "price", "instrument", "user"]
    ).all()

    return list(map(flatten_order_data, orders))

@order_router.get("/create")
async def create_fake_orders():
    await create_orders()

    return 
