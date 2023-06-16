import ormar

from app.db import metadata, database

class Person(ormar.Model):
    class Meta:
        tablename = "Person"
        metadata = metadata
        database = database
    
    uuid: str = ormar.UUID(primary_key=True)

    login: str = ormar.String(min_length=4, max_length=20)
    password: str = ormar.String(min_length=4)

    created_at: int = ormar.Integer(minimum=0)
