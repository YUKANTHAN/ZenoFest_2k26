from pydantic import BaseModel, Field

class LookupEmail(BaseModel):
    email: str = Field(..., pattern=r"^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$")
