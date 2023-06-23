from fastapi import APIRouter
from app.models.instrument import Instrument
from app.schemas.base import InstrumentData

from app.db.create_data import create_instruments

instrument_router = APIRouter(prefix="/instruments", tags=["Instruments"])


@instrument_router.get(
    "/",
    summary="Get all instruments",
    description="Returns list of all existing instruments with positions"
)
async def get_all_intruments() -> list[InstrumentData]:
    return await Instrument.objects.all()


@instrument_router.get(
    "/create",
    summary="Generate fake instruments",
    description="""
        Creates few instruments and adds them to databse (for testing purposes)
    """
)
async def create_fake_intruments() -> None:
    await create_instruments()
    return 
