# HRMS Lite - Human Resource Management System

A lightweight HRMS application for managing employee records and tracking daily attendance.

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | Angular 19 + Angular Material |
| Backend  | FastAPI (Python)              |
| Database | MongoDB                       |

## Project Structure

```
fastapi/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py           # Application entry point
│   │   ├── config.py         # Environment configuration
│   │   ├── database.py       # MongoDB connection
│   │   ├── models/           # Pydantic data models
│   │   ├── schemas/          # Request/response schemas
│   │   └── routes/           # API route handlers
│   ├── requirements.txt
│   └── .env
├── frontend/                 # Angular frontend
│   └── src/
│       ├── app/
│       │   ├── components/   # UI components
│       │   ├── models/       # TypeScript interfaces
│       │   └── services/     # HTTP services
│       └── environments/     # Environment configs
└── README.md
```

## Features

- **Employee Management**: Add, view, and delete employees
- **Attendance Tracking**: Mark daily attendance (Present/Absent), view records per employee
- **Dashboard**: Summary stats (total employees, present/absent counts, departments)
- **Date Filtering**: Filter attendance records by date range
- **Attendance Summary**: View per-employee present/absent totals

## Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local install or MongoDB Atlas free tier)

## Setup Instructions

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env with your MongoDB connection string

# Run the server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
ng serve
```

App available at: http://localhost:4200

### 3. Database Setup

**Option A: Local MongoDB**
- Install MongoDB Community Edition
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (recommended for deployment)**
1. Create free account at https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URL` in `backend/.env`

## API Endpoints

| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| GET    | `/api/health`                         | Health check                   |
| POST   | `/api/employees/`                     | Create employee                |
| GET    | `/api/employees/`                     | List all employees             |
| GET    | `/api/employees/{id}`                 | Get employee by ID             |
| DELETE | `/api/employees/{id}`                 | Delete employee                |
| POST   | `/api/attendance/`                    | Mark attendance                |
| GET    | `/api/attendance/{employee_id}`       | Get attendance records         |
| GET    | `/api/attendance/summary/{employee_id}` | Get attendance summary       |
| GET    | `/api/dashboard/summary`              | Dashboard stats                |

## Assumptions & Limitations

- Single admin user (no authentication required per spec)
- Leave management, payroll, and advanced HR features are out of scope
- Attendance can only be marked once per employee per date
