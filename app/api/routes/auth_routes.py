from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.api.schemas.user import UserCreate, UserLogin, UserInDB
from app.core.database import db
from app.core.config import settings
from passlib.context import CryptContext
from typing import Any
from datetime import datetime, timedelta, timezone
from bson import ObjectId
import jwt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Using pbkdf2_sha256 to avoid bcrypt version conflict
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    database = db.get_db()
    user = await database.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    
    # Map _id to id
    user['id'] = str(user['_id'])
    return UserInDB(**user)

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/auth/signup")
async def signup(user: UserCreate) -> Any:
    user.email = user.email.lower()
    database = db.get_db()
    existing_user = await database.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = get_password_hash(user.password)
    user_doc = {"email": user.email, "hashed_password": hashed}
    result = await database.users.insert_one(user_doc)
    
    return {"message": "User created successfully", "id": str(result.inserted_id)}

@router.post("/auth/login")
async def login(user: UserLogin) -> Any:
    user.email = user.email.lower()
    database = db.get_db()
    user_doc = await database.users.find_one({"email": user.email})
    if not user_doc or not verify_password(user.password, user_doc["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "email": user.email}

@router.get("/auth/me", response_model=UserInDB)
async def get_profile(current_user: UserInDB = Depends(get_current_user)):
    return current_user
