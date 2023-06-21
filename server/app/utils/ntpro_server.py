import fastapi
import pydantic
import starlette.datastructures
from app.models.market_subscription import MarketSubscription

from logging import  getLogger

from app.schemas import client_messages, server_messages, base

class NTProServer:
    def __init__(self):
        self.connections: dict[starlette.datastructures.Address, base.Connection] = {}
        self.logger = getLogger("Root.WebSocket")
        self.logger.setLevel(0)
        self.logger.propagate = True

    async def connect(self, websocket: fastapi.WebSocket):

        user_subscriptions = await MarketSubscription.objects.prefetch_related(
            [MarketSubscription.instrument],
        ).filter(
            user=websocket.state.user
        ).all()

        self.connections[websocket.client] = base.Connection(
            socket=websocket,
            subscriptions=list(
                map(
                    lambda sub: base.MarketSubscriptionModel.from_orm(sub),
                    user_subscriptions
                )
            )
        )
        
        await websocket.accept()

        self.logger.info(
            f"Accepted new connection for user: {websocket.state.user.login}"
        )

    def disconnect(self, websocket: fastapi.WebSocket):
        self.connections.pop(websocket.client)
        self.logger.info(f"Client {websocket.client} disconnected")

    async def serve(self, websocket: fastapi.WebSocket):
        while True:
            raw_envelope = await websocket.receive_json()
            self.logger.info("Recieved raw envelope")
            try:
                self.logger.debug("Parsing recieved message")
                envelope = client_messages.ClientEnvelope.parse_obj(raw_envelope)
                message = envelope.get_parsed_message()
            except pydantic.ValidationError as ex:
                self.logger.debug("Message didn't pass validation")
                await self.send(server_messages.ErrorInfo(reason=str(ex)), websocket)
                continue

            response = await message.process(self, websocket)

            await self.send(response, websocket)

    @staticmethod
    async def send(message: base.MessageT, websocket: fastapi.WebSocket):
        await websocket \
            .send_json(server_messages \
                .ServerEnvelope(
                    message_type=message.get_type(),
                    message=message.dict()
                ).dict()
            )
