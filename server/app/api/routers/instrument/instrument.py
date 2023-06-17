from typing import List
from fastapi import APIRouter
from app.models.instrument import Instrument
from app.schemas.server_messages import InstrumentData

instrument_router = APIRouter(prefix="/instruments")

@instrument_router.get("/")
async def get_intruments() -> List[InstrumentData]:
    instruments = await Instrument.objects.all()
    print(instruments)
    return instruments
