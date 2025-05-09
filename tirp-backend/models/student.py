from sqlmodel import SQLModel, Field
from typing import Optional

class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    studentClass: str
    academic: int
    wellbeing: int
    friends: str         # comma-separated string
    disrespectful: str
    activities: str
