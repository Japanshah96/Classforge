from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_session
from db.models import Student
from datetime import datetime
from collections import defaultdict

router = APIRouter()

@router.get("/stats-summary")
def get_dashboard_stats(session: Session = Depends(get_session)):
    # Fetch all students from the database
    students = session.query(Student).all()
    total_students = len(students)

    # Get unique class names
    unique_classes = set(s.studentClass for s in students)

    # Calculate overall averages
    avg_academic = round(
        sum(s.academic for s in students) / total_students, 2
    ) if total_students > 0 else 0

    avg_wellbeing = round(
        sum(s.wellbeing for s in students) / total_students, 2
    ) if total_students > 0 else 0

    # Calculate classwise averages
    class_averages = []
    if total_students > 0:
        classwise = defaultdict(list)
        for student in students:
            classwise[student.studentClass].append(student)

        for class_name, group in classwise.items():
            class_avg_academic = round(sum(s.academic for s in group) / len(group), 2)
            class_avg_wellbeing = round(sum(s.wellbeing for s in group) / len(group), 2)
            class_averages.append({
                "class": class_name,
                "avgAcademic": class_avg_academic,
                "avgWellbeing": class_avg_wellbeing
            })

    return {
        "total": total_students,
        "classes": len(unique_classes),
        "avgAcademic": avg_academic,
        "avgWellbeing": avg_wellbeing,
        "lastUpdated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "classAverages": class_averages  # ✅ This is used by the frontend graph
    }
