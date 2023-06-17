import ormar

from app.db import Base, database
from app.models.instrument import Instrument
from app.models.user import Person
from app.models.base import create_model_meta


class MarketSubscription(ormar.Model):
    class Meta:
        tablename= "Subscription"
        metadata= Base.metadata
        database= database

    id: int = ormar.Integer(primary_key=True)

    instrument: Instrument = ormar.ForeignKey(
        Instrument, related_name="subscriptions", ondelete="CASCADE"
    )
    user: Person = ormar.ForeignKey(
        Person, related_name="subscriptions", ondelete="CASCADE"
    )
