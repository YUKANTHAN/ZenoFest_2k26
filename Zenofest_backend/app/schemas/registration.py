from pydantic import BaseModel, Field, field_validator
from typing import Optional, List

class RegistrationCreate(BaseModel):
    team_name: str = Field(..., min_length=1)
    leader_name: str = Field(..., min_length=1)
    leader_email: str = Field(..., pattern=r"^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$")
    leader_phone: Optional[str] = None
    college_name: Optional[str] = None
    department: Optional[str] = None
    event_code: str
    total_participants: int = Field(..., gt=0)
    participants: List["ParticipantCreate"] = []

class ParticipantCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., pattern=r"^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$")
    phone: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
