from fastapi import APIRouter
from app.models.instrument import Instrument
from app.schemas.base import InstrumentData

from app.db.create_data import create_instruments

instrument_router = APIRouter(prefix="/instruments")

@instrument_router.get("/")
async def get_intruments() -> list[InstrumentData]:
    return await Instrument.objects.all()

@instrument_router.get("/create")
async def create_fake_intruments() -> list[InstrumentData]:
    await create_instruments()
    return 
