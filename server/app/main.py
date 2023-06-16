from fastapi import FastAPI
from app import api
from app.db import database

app = FastAPI()

app.include_router(api.router)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
