import os

import databases
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = os.environ.get("DATABASE_URL")
DATABASE_URL = f"{DATABASE_URL}" if os.environ.get("TEST") else DATABASE_URL

db = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

engine = sqlalchemy.create_engine(
    DATABASE_URL, echo=True
)

Base = declarative_base(bind=engine)

