import asyncio
import random
from uuid import uuid4

from app.models.order import Order
from app.models.user import Person
from app.models.instrument import Instrument
from app.utils.enums import OrderSide, OrderStatus

async def create_instruments():
    names = ["CHN/RUB", "EUR/USD", "EUR/RUB", "TRY/RUB", "BYN/RUB"]

    instruments = [
        Instrument.objects.create(
            name=instr_name
        ) for instr_name in names
    ]

    await asyncio.wait(instruments)

    return

async def create_orders():

    users = await Person.objects.all()
    instruments = await Instrument.objects.all()

    orders = [ 
        Order.objects.create(
            order_id=str(uuid4()),
            instrument=random.choice(instruments),
            user=random.choice(users),
            side=random.choice(list(OrderSide)),
            status=random.choice(list(OrderStatus)),
            amount=random.randint(1, 1_000_000),
            price=random.randint(0,1_000_000)/10_000
        ) for i in range(30)
    ]

    await asyncio.wait(orders)

    return