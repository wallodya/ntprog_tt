from typing import Annotated, Union
from fastapi import APIRouter, Query

from app.models.order import Order
from app.schemas.base import OrderData

from app.db.create_data import create_orders

order_router = APIRouter(prefix="/orders")

def flatten_order_data(order: Order) -> OrderData:
    return {
            "order_id": order.order_id,
            "side": order.side,
            "amount": order.amount,
            "price": order.price,
            "status": order.status,
            "user_id": order.user.uuid,
            "instrument": order.instrument.name,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
    }

@order_router.get("/")
async def get_orders(page: Annotated[Union[int, None], Query()] = 1) -> list[OrderData]:

    orders = await Order.objects.paginate(
        1 if page <= 0 else page
    ).prefetch_related(
        [Order.user, Order.instrument]
    ).order_by(
        "-created_at"
    ).all()

    flattened = list(map(flatten_order_data, orders))
    return flattened

@order_router.get("/create")
async def create_fake_orders() -> None:
    await create_orders()
    return 
