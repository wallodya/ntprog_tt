import ormar

from app.db import Base, database
from app.models.instrument import Instrument
from app.models.order import Order
from app.models.base import create_model_meta

class Quote(ormar.Model):
    class Meta:
        tablename= "Quote"
        metadata= Base.metadata
        database= database
    
    quote_id: int = ormar.Integer(primary_key=True)

    bid: Order = ormar.ForeignKey(
        Order,
        skip_reverse=True,
        related_name="quotes_on_bid",
        ondelete="CASCADE"
    )
    offer: Order = ormar.ForeignKey(
        Order,
        skip_reverse=True,
        related_name="qoutes_on_offer",
        ondelete="CASCADE"
    )

    instrument: Instrument = ormar.ForeignKey(
        Instrument,
        skip_reverse=True,
        related_name="qoutes_on_instrument",
        ondelete="CASCADE"
    )

    timestamp: int = ormar.Integer(minimum=0)
