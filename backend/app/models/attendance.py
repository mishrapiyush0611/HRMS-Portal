from pydantic import BaseModel, Field
from typing import Literal
from datetime import date, datetime


class AttendanceModel(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: str
    status: Literal["Present", "Absent"]
    marked_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"json_schema_extra": {
        "example": {
            "employee_id": "EMP001",
            "date": "2026-03-18",
            "status": "Present",
        }
    }}
