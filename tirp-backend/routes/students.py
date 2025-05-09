from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.database import get_session
from models.student import Student

router = APIRouter()


@router.post("/students")
def add_student(student: Student, session: Session = Depends(get_session)):
    session.add(student)
    session.commit()
    session.refresh(student)
    return {"message": "Student added", "student": student}


@router.get("/students")
def get_students(session: Session = Depends(get_session)):
    return session.exec(select(Student)).all()


@router.get("/students/{student_id}")
def get_student(student_id: int, session: Session = Depends(get_session)):
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/students/{student_id}")
def update_student(student_id: int, updated_student: Student, session: Session = Depends(get_session)):
    existing = session.get(Student, student_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update each field one by one
    updated_data = updated_student.dict(exclude_unset=True)
    for field, value in updated_data.items():
        setattr(existing, field, value)

    session.add(existing)
    session.commit()
    session.refresh(existing)
    return {"message": "Student updated", "student": existing}


@router.delete("/students/{student_id}")
def delete_student(student_id: int, session: Session = Depends(get_session)):
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    session.delete(student)
    session.commit()
    return {"message": f"Student with ID {student_id} deleted"}
