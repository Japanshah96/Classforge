from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from db.database import get_session
from db.models import User
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "supersecret1234"

# ✅ Input schema for signup/login
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

def create_token(user_id: int):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@router.post("/signup")
def signup(user: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=pwd_context.hash(user.password),
        full_name=user.full_name
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"msg": "Signup successful", "user_id": new_user.id}

@router.post("/login")
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user.id)
    return {"access_token": token, "token_type": "bearer"}