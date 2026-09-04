from fastapi import APIRouter
from app.config import eventsData

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/")
def get_events():
    return {"events": eventsData}