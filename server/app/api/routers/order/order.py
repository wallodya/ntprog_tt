from typing import Annotated, Union
from uuid import uuid4
from fastapi import APIRouter, BackgroundTasks, Query
from fastapi.responses import FileResponse

from app.schemas.base import OrderData

from app.crud.base import  get_orders_for_page, write_orders_to_csv, remove_file

from app.db.create_data import create_orders

order_router = APIRouter(prefix="/orders")


@order_router.get("/")
async def get_orders(page: Annotated[Union[int, None], Query()] = 1) -> list[OrderData]:
    return await get_orders_for_page(page)

@order_router.get("/download")
async def download_orders_table(background_tasks: BackgroundTasks):
    
    temp_csv_path = f"./app/api/routers/order/data/temp_orders_{str(uuid4())}.csv"

    await write_orders_to_csv(temp_csv_path)
    
    background_tasks.add_task(remove_file, temp_csv_path)
    return FileResponse(temp_csv_path, filename="orders.csv")

@order_router.get("/create")
async def create_fake_orders() -> None:
    await create_orders()
    return 
