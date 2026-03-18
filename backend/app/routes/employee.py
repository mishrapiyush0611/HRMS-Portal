from fastapi import APIRouter, HTTPException, status
from app.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeListResponse
from app.models.employee import EmployeeModel
from pymongo.errors import DuplicateKeyError
from datetime import datetime

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    db = get_db()

    doc = EmployeeModel(
        **employee.model_dump(),
        created_at=datetime.utcnow(),
    )

    try:
        await db.employees.insert_one(doc.model_dump())
    except DuplicateKeyError:
        existing = await db.employees.find_one({
            "$or": [
                {"employee_id": employee.employee_id},
                {"email": employee.email},
            ]
        })
        if existing and existing.get("employee_id") == employee.employee_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with ID '{employee.employee_id}' already exists",
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email '{employee.email}' already exists",
        )

    return EmployeeResponse(**doc.model_dump())


@router.get("/", response_model=EmployeeListResponse)
async def list_employees():
    db = get_db()
    cursor = db.employees.find().sort("created_at", -1)
    employees = []
    async for doc in cursor:
        doc.pop("_id", None)
        employees.append(EmployeeResponse(**doc))
    return EmployeeListResponse(employees=employees, total=len(employees))


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str):
    db = get_db()
    doc = await db.employees.find_one({"employee_id": employee_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found",
        )
    doc.pop("_id", None)
    return EmployeeResponse(**doc)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    db = get_db()
    result = await db.employees.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found",
        )
    await db.attendance.delete_many({"employee_id": employee_id})
