import pathlib
import mimetypes

import fastapi
from fastapi import APIRouter

from app.api.routers import  instrument, order, auth
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

@api_router.get("/ws")
async def connect_to_websocket(websocket: fastapi.WebSocket):
    await websocket_server.connect(websocket)

    try:
        await websocket_server.serve(websocket)
    except fastapi.WebSocketDisconnect:
        websocket_server.disconnect()

@api_router.get("/static/{path}")
async def get_static(path: pathlib.Path):
    static_file = (pathlib.Path('static') / path).read_text()
    mime_type, encoding = mimetypes.guess_type(path)
    return fastapi.responses.PlainTextResponse(static_file, media_type=mime_type)
