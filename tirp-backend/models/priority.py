from sqlmodel import SQLModel, Field

class Priority(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    academic_weight: float
    wellbeing_weight: float
    friends_weight: float
    disrespect_weight: float
    activities_weight: float
