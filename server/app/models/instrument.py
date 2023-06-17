import ormar

from app.db import Base, database
from app.models.base import create_model_meta

class Instrument(ormar.Model):
    # create_model_meta("Instrument")
    class Meta:
        tablename= "Instrument"
        metadata= Base.metadata
        database= database

    instrument_id: int = ormar.Integer(primary_key=True)
    name: str = ormar.String(min_length=5, max_length=20)