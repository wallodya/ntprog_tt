from typing import Annotated, Union
from fastapi import APIRouter, Query

from app.schemas.base import OrderData

from app.crud.base import  get_orders_for_page

from app.db.create_data import create_orders

order_router = APIRouter(prefix="/orders")


@order_router.get("/")
async def get_orders(page: Annotated[Union[int, None], Query()] = 1) -> list[OrderData]:
    return await get_orders_for_page(page)

@order_router.get("/create")
async def create_fake_orders() -> None:
    await create_orders()
    return 
