import pathlib

import fastapi
from fastapi import APIRouter

from app.api.routers import  instrument, order, user

api_router = APIRouter(prefix="/api")

api_router.include_router(order.router)
api_router.include_router(user.router)
api_router.include_router(instrument.router)

html = pathlib.Path("./app/index.html").read_text()

@api_router.get("/")
def get_index():
    return fastapi.responses.HTMLResponse(html)
