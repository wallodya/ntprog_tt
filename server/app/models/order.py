import ormar

from app.db import database, Base
from app.utils.enums import OrderSide, OrderStatus
from app.models.user import Person
from app.models.instrument import Instrument


class Order(ormar.Model):
    class Meta:
        tablename= "Order"
        metadata= Base.metadata
        database= database

    order_id: str = ormar.String(max_length=100, primary_key=True)

    instrument = ormar.ForeignKey(
        Instrument, related_name="orders",ondelete="CASCADE"
    )
    user = ormar.ForeignKey(
        Person, related_name="orders",ondelete="CASCADE"
    )

    side: int = ormar.Integer(choises=list(OrderSide))
    status: int = ormar.Integer(choices=list(OrderStatus))
    amount: int = ormar.Integer(minimum=1)
    price: float = ormar.Decimal(minimum=0.01,precision=10,scale=4)

    created_at: int = ormar.BigInteger(minimum=0)
    updated_at: int = ormar.BigInteger(minimum=0)

