import ormar

from app.db import Base, database

class Instrument(ormar.Model):
    class Meta:
        tablename= "Instrument"
        metadata= Base.metadata
        database= database

    instrument_id: int = ormar.Integer(primary_key=True,autoincrement=True)
    name: str = ormar.String(min_length=5, max_length=20)

    buy_position = ormar.Decimal(minimum=0,precision=15,scale=4,default=0)
    sell_position = ormar.Decimal(minimum=0,precision=15,scale=4,default=0)