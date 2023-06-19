import fastapi
import pydantic
import starlette.datastructures
from app.models.market_subscription import MarketSubscription

from app.schemas import client_messages, server_messages, base

class NTProServer:
    def __init__(self):
        self.connections: dict[starlette.datastructures.Address, base.Connection] = {}

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

    def disconnect(self, websocket: fastapi.WebSocket):
        self.connections.pop(websocket.client)

    async def serve(self, websocket: fastapi.WebSocket):
        while True:
            raw_envelope = await websocket.receive_json()

            try:
                envelope = client_messages.ClientEnvelope.parse_obj(raw_envelope)
                message = envelope.get_parsed_message()
            except pydantic.ValidationError as ex:
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
