from typing import List
from fastapi import APIRouter
from app.models.instrument import Instrument
from app.schemas.server_messages import InstrumentData

from app.db.create_data import create_instruments

instrument_router = APIRouter(prefix="/instruments")

@instrument_router.get("/")
async def get_intruments() -> List[InstrumentData]:
    instruments = await Instrument.objects.all()
    return instruments

@instrument_router.get("/create")
async def create_fake_intruments() -> List[InstrumentData]:
    await create_instruments()
    return 
