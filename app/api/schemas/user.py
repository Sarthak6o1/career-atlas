from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    hashed_password: str
    resume_text: str | None = None
    resume_filename: str | None = None
    created_at: str | None = None
