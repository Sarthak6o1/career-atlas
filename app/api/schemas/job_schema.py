from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    salary: Optional[str] = None
    notes: Optional[str] = None  # Added notes here
    status: str = Field(default="saved") # saved, applied, interviewing, offer, rejected

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class Job(JobBase):
    id: str
    user_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class JobSearchRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None

class JobSearchResult(BaseModel):
    result_md: str
