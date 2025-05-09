from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from db.database import get_session
from ai_model.allocator import run_allocation

router = APIRouter()

@router.post("/run-allocation-ai")
def trigger_allocation(session: Session = Depends(get_session), bg: BackgroundTasks = BackgroundTasks()):
    def task():
        run_allocation(session)
    bg.add_task(task)
    return {"message": "🧠 Allocation is being processed."}