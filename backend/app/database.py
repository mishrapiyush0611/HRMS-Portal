from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]

    await db.employees.create_index("employee_id", unique=True)
    await db.employees.create_index("email", unique=True)
    await db.attendance.create_index([("employee_id", 1), ("date", 1)], unique=True)


async def close_db():
    global client
    if client:
        client.close()


def get_db() -> AsyncIOMotorDatabase:
    return db
