from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import init_db
from routes import students, priorities, export, dashboard, stats, auth, ai_allocator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
app.include_router(students.router)
app.include_router(priorities.router)
app.include_router(export.router)
app.include_router(dashboard.router)
app.include_router(stats.router)
app.include_router(auth.router)
app.include_router(ai_allocator.router)


