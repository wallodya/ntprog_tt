import pathlib
import fastapi
from fastapi import APIRouter

from app.api.routers import  instrument, order, auth
from app.core.config import AUTH_COOKIE_NAME
from app.core.security import get_user_by_id
from app.utils import ntpro_server

from app.utils.logger import root_logger

html = pathlib.Path("./app/index.html").read_text()
websocket_server = ntpro_server.NTProServer()

api_router = APIRouter(prefix="/api")

api_router.include_router(order.router)
api_router.include_router(auth.router)
api_router.include_router(instrument.router)

@api_router.get(
    "/",
    summary="Basic GET endpoint",
    description="""Returns 'hello world'-like  html page""",
    tags=["Main"]
)
def get_index():
    return fastapi.responses.HTMLResponse(html)

@api_router.websocket("/ws")
async def connect_to_websocket(websocket: fastapi.WebSocket):
    root_logger.info("Client attempting to establish websocket connection")

    cookie = websocket.cookies.get(AUTH_COOKIE_NAME)
    user = await get_user_by_id(cookie)

    if not user:
        root_logger.warn(
            "Unauthorized user tried to connect to WebSocket"
        )
        raise fastapi.WebSocketException(fastapi.status.HTTP_401_UNAUTHORIZED)

    websocket.state.user = user
    await websocket_server.connect(websocket)

    try:
        await websocket_server.serve(websocket)
    except fastapi.WebSocketDisconnect:
        websocket_server.disconnect(websocket)
