import pytest
import warnings
import os

import alembic
from alembic.config import Config

from fastapi import FastAPI
from databases import Database
from asgi_lifespan import LifespanManager
from httpx import AsyncClient

@pytest.fixture(scope="session")
def apply_migrations():
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    os.environ["TESTING"] = "1"
    config = Config("alembic.ini")
    alembic.command.upgrade(config, "head")
    yield
    alembic.command.downgrade(config, "base")

@pytest.fixture
def app(apply_migrations: None) -> FastAPI:
    from app.main import app
    return  app


@pytest.fixture
def db(app: FastAPI) -> Database:
    return app.state._db

@pytest.fixture
async def client(app: FastAPI) -> AsyncClient:
    async with LifespanManager(app):
        async with AsyncClient(
            app=app,
            base_url="http://testserver",
            headers={"Content-Type": "application/json"}
        ) as client:
            yield client