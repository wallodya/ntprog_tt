import os

import databases
import sqlalchemy

DATABASE_URL = os.environ.get("DATABASE_URL")

db = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

engine = sqlalchemy.create_engine(
    DATABASE_URL, echo=True
)

metadata.create_all(engine)
