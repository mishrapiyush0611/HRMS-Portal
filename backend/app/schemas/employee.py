from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, description="Unique employee ID")
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)


class EmployeeResponse(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    model_config = {"from_attributes": True}


class EmployeeListResponse(BaseModel):
    employees: list[EmployeeResponse]
    total: int
