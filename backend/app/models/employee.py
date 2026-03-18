from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class EmployeeModel(BaseModel):
    employee_id: str = Field(..., min_length=1, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"json_schema_extra": {
        "example": {
            "employee_id": "EMP001",
            "full_name": "John Doe",
            "email": "john.doe@company.com",
            "department": "Engineering",
        }
    }}
