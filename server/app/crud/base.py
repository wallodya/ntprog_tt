from math import floor
import time
import uuid
import ormar
import os

from app.models.instrument import Instrument
from app.models.order import Order
from app.models.user import Person
from app.schemas.base import OrderData, UserData, UserDataIn
from app.core.security import generate_hashed_password


async def get_insturment_by_id(id: int) -> Instrument:
    from app.schemas import server_messages

    try:
        instrument = await Instrument.objects.get(instrument_id=id)
    except ormar.NoMatch:
        return server_messages.ErrorInfo(
            reason=f"Instrument with id {id} does not exists"
        )

    return instrument


async def create_user(user_data: UserDataIn) -> UserData:
    user_id = str(uuid.uuid4())

    hashed_password = generate_hashed_password(user_data.password)

    new_user = await Person.objects.create(
        login=user_data.login,
        password=hashed_password,
        uuid=user_id,
        created_at=time.time() * 1000
    )

    return {
        "login": new_user.login,
        "uuid": new_user.uuid,
        "created_at": new_user.created_at,
        "subscriptions": []
    }


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


async def get_orders_for_page(page: int) -> list[OrderData]:

    orders = await Order.objects.paginate(
        1 if page <= 0 else floor(page)
    ).prefetch_related(
        [Order.user, Order.instrument]
    ).order_by(
        "-created_at"
    ).all()

    return list(map(flatten_order_data, orders))


async def write_orders_to_csv(path: str):

    async def get_order_dicts_for_page(page: int) -> list[dict]:
        orders = await get_orders_for_page(page)
        return list(map(dict, orders))

    def create_csv_headers(d: dict) -> str:
        return ",".join(d.keys()) + "\n"

    def create_csv_row(d: dict) -> str:
        return ",".join(map(str, d.values())) + "\n"

    with open(path, "w") as file:
        page = 1
        orders = await get_order_dicts_for_page(page)

        file.write(create_csv_headers(orders[0]))

        while len(orders) > 0:
            for order in orders:
                file.write(create_csv_row(order))
            page += 1
            orders = await get_order_dicts_for_page(page)

    return

def remove_file(path: str):
    os.remove(path)
    return