from fastapi import APIRouter, Response
from sqlmodel import select
from db.database import get_session
from models.student import Student
import pandas as pd

router = APIRouter()

@router.get("/export/csv")
def export_students():
    session = get_session()
    students = session.exec(select(Student)).all()

    df = pd.DataFrame([s.dict() for s in students])
    csv_data = df.to_csv(index=False)

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"}
    )
