from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import connect_db, close_db
from app.routes.employee import router as employee_router
from app.routes.attendance import router as attendance_router
from app.routes.dashboard import router as dashboard_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_router, prefix="/api")
app.include_router(attendance_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "HRMS Lite API"}
