from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_session
from db.models import Student
from datetime import datetime
from collections import defaultdict

router = APIRouter()

@router.get("/stats-summary")
def get_dashboard_stats(session: Session = Depends(get_session)):
    students = session.query(Student).all()
    total_students = len(students)
    unique_classes = set(s.studentClass for s in students)

    avg_academic = round(sum(s.academic for s in students) / total_students, 2) if total_students > 0 else 0
    avg_wellbeing = round(sum(s.wellbeing for s in students) / total_students, 2) if total_students > 0 else 0

    # Classwise averages
    classwise = defaultdict(list)
    for student in students:
        classwise[student.studentClass].append(student)

    class_averages = [
        {
            "class": class_name,
            "avgAcademic": round(sum(s.academic for s in group) / len(group), 2),
            "avgWellbeing": round(sum(s.wellbeing for s in group) / len(group), 2)
        }
        for class_name, group in classwise.items()
    ]

    return {
        "total": total_students,
        "classes": len(unique_classes),
        "avgAcademic": avg_academic,
        "avgWellbeing": avg_wellbeing,
        "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "classAverages": class_averages
    }
