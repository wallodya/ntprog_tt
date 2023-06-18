import pathlib
import mimetypes
from typing import Annotated

import fastapi
from fastapi import APIRouter, Cookie, Header, Query, Request

from app.api.routers import  instrument, order, auth
from app.core.config import AUTH_COOKIE_NAME
from app.core.security import get_user_by_id
from app.utils import ntpro_server

html = pathlib.Path("./app/index.html").read_text()
websocket_server = ntpro_server.NTProServer()

api_router = APIRouter(prefix="/api")

api_router.include_router(order.router)
api_router.include_router(auth.router)
api_router.include_router(instrument.router)

@api_router.get("/")
def get_index():
    return fastapi.responses.HTMLResponse(html)

@api_router.websocket("/ws")
async def connect_to_websocket(websocket: fastapi.WebSocket, uuid: Annotated[str | None, Header()] = None):
    cookie = websocket.cookies.get(AUTH_COOKIE_NAME)
    user = await get_user_by_id(cookie if cookie else uuid)

    websocket.state.user = user

    await websocket_server.connect(websocket)

    try:
        await websocket_server.serve(websocket)
    except fastapi.WebSocketDisconnect:
        websocket_server.disconnect(websocket)

@api_router.get("/static/{path}")
async def get_static(path: pathlib.Path):
    static_file = (pathlib.Path('static') / path).read_text()
    mime_type, encoding = mimetypes.guess_type(path)
    return fastapi.responses.PlainTextResponse(static_file, media_type=mime_type)
