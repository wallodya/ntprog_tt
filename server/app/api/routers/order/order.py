from typing import Annotated, Union
from uuid import uuid4
from fastapi import APIRouter, BackgroundTasks, Query
from fastapi.responses import FileResponse

from app.schemas.base import OrderData

from app.crud.base import get_orders_for_page, write_orders_to_csv, remove_file

from app.db.create_data import create_orders

order_router = APIRouter(prefix="/orders",tags=["Orders"])


@order_router.get(
    "/",
    summary="Get orders",
    description="Returns list of orders (up to 20) for requested page"
)
async def get_orders(
    page: Annotated[

        Union[int, None],
        Query(examples={
            "valid": {
                "summary": "Positive integer",
                "description": """
                    Expected parameter, returns list of orders for page
                """,
                "value": 1
            },
            "out of boundaries": {
                "summary": "Requested page doesn't exists",
                "description": """
                    If parameter is valid but page does not exists,
                    returns empty list
                """,
                "value": 100012
            },
            "invalid float": {
                "summary": "Float number",
                "description": """
                    Any float number will raise an validation exception
                """,
                "value": 1.123
            },
            "invalid non-positive": {
                "summary": "Negative integer",
                "description": """
                    Any non-positive integer will be converted to 1,
                    returns list of orders for first page
                """,
                "value": -3
            }
        })

    ] = 1,
) -> list[OrderData]:
    
    return await get_orders_for_page(page)


@order_router.get(
    "/download",
    summary="Download orders",
    description="Downloads all orders as CSV file"
)
async def download_orders_table(background_tasks: BackgroundTasks):

    temp_csv_path = f"./app/api/routers/order/data/temp_orders_{str(uuid4())}.csv"

    await write_orders_to_csv(temp_csv_path)

    background_tasks.add_task(remove_file, temp_csv_path)
    return FileResponse(temp_csv_path, filename="orders.csv")


@order_router.get(
    "/create",
    summary="Generate fake orders",
    description="Creates and adds orders to database (for testing purposes)"
)
async def create_fake_orders() -> None:
    await create_orders()
    return
