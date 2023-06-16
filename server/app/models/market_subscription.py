import ormar

from app.db import metadata, database
from app.models.instrument import Instrument
from app.models.user import Person


class MarketSubscription(ormar.Model):
    class Meta:
        tablename = "Subscription"
        metadata = metadata
        database = database

    id: int = ormar.Integer(primary_key=True)

    instrument: Instrument = ormar.ForeignKey(Instrument, skip_reverse=True)
    user: Person = ormar.ForeignKey(Person, skip_reverse=True)
