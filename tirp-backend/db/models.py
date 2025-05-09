from sqlmodel import SQLModel, Field

class Student(SQLModel, table=True):
    __tablename__ = "student"
    __table_args__ = {"extend_existing": True}

    id: int | None = Field(default=None, primary_key=True)
    name: str
    studentClass: str
    academic: int
    wellbeing: int
    friends: str
    disrespectful: str
    activities: str


class Priority(SQLModel, table=True):
    __tablename__ = "priority"
    __table_args__ = {"extend_existing": True}

    id: int | None = Field(default=None, primary_key=True)
    academic_weight: float
    wellbeing_weight: float
    friends_weight: float
    disrespect_weight: float
    activities_weight: float


class User(SQLModel, table=True):
    __tablename__ = "user"
    __table_args__ = {"extend_existing": True}

    id: int | None = Field(default=None, primary_key=True)
    email: str
    hashed_password: str
    full_name: str | None = None
    is_active: bool = True

