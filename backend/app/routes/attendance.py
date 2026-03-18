from fastapi import APIRouter, HTTPException, Query, status
from app.database import get_db
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceListResponse,
    AttendanceSummary,
)
from app.models.attendance import AttendanceModel
from pymongo.errors import DuplicateKeyError
from datetime import date, datetime
from typing import Optional

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(record: AttendanceCreate):
    db = get_db()

    emp = await db.employees.find_one({"employee_id": record.employee_id})
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{record.employee_id}' not found",
        )

    doc = AttendanceModel(
        employee_id=record.employee_id,
        date=record.date.isoformat(),
        status=record.status,
        marked_at=datetime.utcnow(),
    )

    try:
        await db.attendance.insert_one(doc.model_dump())
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for '{record.employee_id}' on {record.date}",
        )

    return AttendanceResponse(**doc.model_dump())


@router.get("/{employee_id}", response_model=AttendanceListResponse)
async def get_attendance(
    employee_id: str,
    from_date: Optional[date] = Query(None, description="Filter from date"),
    to_date: Optional[date] = Query(None, description="Filter to date"),
):
    db = get_db()

    emp = await db.employees.find_one({"employee_id": employee_id})
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found",
        )

    query: dict = {"employee_id": employee_id}
    if from_date or to_date:
        date_filter = {}
        if from_date:
            date_filter["$gte"] = from_date.isoformat()
        if to_date:
            date_filter["$lte"] = to_date.isoformat()
        query["date"] = date_filter

    cursor = db.attendance.find(query).sort("date", -1)
    records = []
    async for doc in cursor:
        doc.pop("_id", None)
        records.append(AttendanceResponse(**doc))

    return AttendanceListResponse(records=records, total=len(records))


@router.get("/summary/{employee_id}", response_model=AttendanceSummary)
async def get_attendance_summary(employee_id: str):
    db = get_db()

    emp = await db.employees.find_one({"employee_id": employee_id})
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found",
        )

    pipeline = [
        {"$match": {"employee_id": employee_id}},
        {"$group": {
            "_id": "$status",
            "count": {"$sum": 1},
        }},
    ]

    results = {}
    async for doc in db.attendance.aggregate(pipeline):
        results[doc["_id"]] = doc["count"]

    present = results.get("Present", 0)
    absent = results.get("Absent", 0)

    return AttendanceSummary(
        employee_id=employee_id,
        full_name=emp.get("full_name", ""),
        total_present=present,
        total_absent=absent,
        total_days=present + absent,
    )
