import ormar

from app.db import metadata, database

class Instrument(ormar.Model):
    class Meta:
        tablename = "Instrument"
        metadata = metadata
        database = database

    instrument_id: int = ormar.Integer(primary_key=True)
    name: str = ormar.String(min_length=5, max_length=20)