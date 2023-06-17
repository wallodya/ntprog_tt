import ormar

from app.db import Base, database
from app.models.instrument import Instrument
from app.models.order import Order

class Quote(ormar.Model):
    class Meta:
        tablename = "Quote"
        metadata = Base.metadata
        database = database
    
    quote_id: int = ormar.Integer(primary_key=True)

    bid: Order = ormar.ForeignKey(
        Order,
        skip_reverse=True,
        related_name="bid_on_qoute"
    )
    offer: Order = ormar.ForeignKey(
        Order,
        skip_reverse=True,
        related_name="offer_on_qoute"
    )

    instrument: Instrument = ormar.ForeignKey(
        Instrument,
        skip_reverse=True,
        related_name="instrument_on_qoute"
    )

    timestamp: int = ormar.Integer(minimum=0)
