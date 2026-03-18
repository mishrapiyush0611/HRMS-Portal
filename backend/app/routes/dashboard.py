from fastapi import APIRouter
from app.database import get_db
from datetime import date

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_dashboard_summary():
    db = get_db()
    today = date.today().isoformat()

    total_employees = await db.employees.count_documents({})
    total_attendance = await db.attendance.count_documents({})
    total_present = await db.attendance.count_documents({"status": "Present"})
    total_absent = await db.attendance.count_documents({"status": "Absent"})

    today_present = await db.attendance.count_documents({"date": today, "status": "Present"})
    today_absent = await db.attendance.count_documents({"date": today, "status": "Absent"})

    dept_pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    departments = []
    async for doc in db.employees.aggregate(dept_pipeline):
        departments.append({"name": doc["_id"], "count": doc["count"]})

    return {
        "today": today,
        "total_employees": total_employees,
        "total_attendance_records": total_attendance,
        "total_present": total_present,
        "total_absent": total_absent,
        "today_present": today_present,
        "today_absent": today_absent,
        "departments": departments,
    }
