from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import date, datetime


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: date
    status: Literal["Present", "Absent"]


class AttendanceResponse(BaseModel):
    employee_id: str
    date: str
    status: str
    marked_at: datetime

    model_config = {"from_attributes": True}


class AttendanceListResponse(BaseModel):
    records: list[AttendanceResponse]
    total: int


class AttendanceSummary(BaseModel):
    employee_id: str
    full_name: str
    total_present: int
    total_absent: int
    total_days: int
