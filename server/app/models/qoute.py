import ormar

from app.db import metadata, database
from app.models.instrument import Instrument

class Quote(ormar.Model):
    class Meta:
        tablename = "Quote"
        metadata = metadata
        database = database
    
    quote_id: int = ormar.Integer(primary_key=True)

    bid: float = ormar.Decimal(minimum=0.01)
    bid_amount: int = ormar.Integer(minimum=1)
    offer: float = ormar.Decimal(minimum=0.01)
    offer_amount: int = ormar.Integer(minimum=1)

    instrument: Instrument = ormar.ForeignKey(Instrument, skip_reverse=True)

    timestamp: int = ormar.Integer(minimum=0)
