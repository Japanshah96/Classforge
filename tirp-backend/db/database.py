from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Your Supabase PostgreSQL connection string
DATABASE_URL = "postgresql://postgres.ukvwjjsftuolcplxuuqd:P1yPXbX6dnWtCd7J@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

# ✅ Return a generator for FastAPI dependency injection
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
