import asyncio
import random
import time
from uuid import uuid4

from app.models.order import Order
from app.models.quote import Quote
from app.models.user import Person
from app.models.instrument import Instrument
from app.utils.enums import OrderSide, OrderStatus


async def create_instruments() -> None:
    names = ["CHN/RUB", "EUR/USD", "EUR/RUB", "TRY/RUB", "BYN/RUB"]

    instruments = [
        Instrument.objects.create(
            name=instr_name
        ) for instr_name in names
    ]

    await asyncio.wait(instruments)

    return


async def create_orders() -> None:

    users = await Person.objects.all()
    instruments = await Instrument.objects.all()

    async def place_mock_order() -> None:
        random_instrument = random.choice(instruments)
        random_side = random.choice(list(OrderSide))
        random_status = random.choice(list(OrderStatus))
        random_price = random.randint(0,1_000_000)/10_000
        random_amount = random.randint(1, 1_000)

        current_quote = await Quote.objects.prefetch_related(
            [Quote.instrument, Quote.offer, Quote.bid]
        ).filter(
            instrument=random_instrument
        ).order_by(
            "-timestamp"
        ).limit(
            1
        ).get_or_none()

        order = await Order.objects.create(
            order_id=str(uuid4()),
            instrument=random_instrument,
            user=random.choice(users),
            side=random_side,
            status=random_status,
            amount=random_amount,
            price=random_price,
            created_at=time.time() * 1000,
            updated_at=time.time() * 1000
        )

        if random_status == OrderStatus.filled:
            if random_side == OrderSide.buy:
                await random_instrument.update(
                    buy_position=random_instrument.buy_position + random_price * random_amount
                )
            if random_side == OrderSide.sell:
                await random_instrument.update(
                    sell_position=random_instrument.sell_position + random_price * random_amount
                )

        if random_side == OrderSide.buy \
                and (
                    not current_quote or
                    not current_quote.bid or
                    current_quote.bid.price < random_price
                ):

            await Quote.objects.create(
                bid=order,
                offer=current_quote.offer,
                instrument=random_instrument,
                timestamp=time.time() * 1000
            )

        if random_side == OrderSide.buy \
                and (
                    not current_quote or
                    not current_quote.offer or
                    current_quote.offer.price > random_price
                ):

            await Quote.objects.create(
                bid=current_quote.bid,
                offer=order,
                instrument=random_instrument,
                timestamp=time.time() * 1000
            )

        return

    orders = [ 
        place_mock_order() for i in range(30)
    ]

    await asyncio.wait(orders)

    return
