from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_session
from db.models import Priority

router = APIRouter()

@router.post("/priorities")
def save_priorities(priority: Priority, session: Session = Depends(get_session)):
    existing = session.query(Priority).filter(Priority.id == priority.id).first()
    if existing:
        # Update if exists
        existing.academic_weight = priority.academic_weight
        existing.wellbeing_weight = priority.wellbeing_weight
        existing.friends_weight = priority.friends_weight
        existing.disrespect_weight = priority.disrespect_weight
        existing.activities_weight = priority.activities_weight
    else:
        session.add(priority)
    session.commit()
    return {"message": "Priority saved"}

@router.get("/priorities/{priority_id}")
def get_priorities(priority_id: int, session: Session = Depends(get_session)):
    priority = session.query(Priority).filter(Priority.id == priority_id).first()
    if not priority:
        return {"error": "Not found"}
    return priority
