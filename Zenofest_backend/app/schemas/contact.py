from pydantic import BaseModel, Field, field_validator
from typing import Optional

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r"^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$")
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=5, max_length=1000)
    
    @field_validator("name")
    @classmethod
    def name_not_only_spaces(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be only spaces")
        return v