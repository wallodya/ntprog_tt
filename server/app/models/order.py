import ormar

from app.db import database, Base
from app.utils.enums import OrderSide, OrderStatus
from app.models.user import Person
from app.models.instrument import Instrument
from app.models.base import create_model_meta


class Order(ormar.Model):
    class Meta:
        tablename= "Order"
        metadata= Base.metadata
        database= database

    order_id: str = ormar.UUID(primary_key=True)

    instrument: Instrument = ormar.ForeignKey(
        Instrument, related_name="orders",ondelete="CASCADE"
    )
    user: Person = ormar.ForeignKey(
        Person, related_name="orders",ondelete="CASCADE"
    )

    side: int = ormar.Integer(choises=list(OrderSide))
    status: int = ormar.Integer(choices=list(OrderStatus))
    amount: int = ormar.Integer(minimum=1)
    price: float = ormar.Decimal(minimum=0.01,precision=10,scale=4)
