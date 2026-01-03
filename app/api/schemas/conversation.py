from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class Message(BaseModel):
    id: str
    role: str  # 'user', 'assistant', 'system'
    content: str
    type: str = 'text' # 'text', 'markdown'
    tab: str # 'dashboard', 'analyze', 'tailor', etc.
    timestamp: datetime = Field(default_factory=datetime.now)
    sources: Optional[List[Any]] = []

class Conversation(BaseModel):
    id: str = Field(alias="_id") # MongoDB ID or UUID
    user_id: str
    title: str = "New Session"
    messages: List[Message] = []
    updated_at: datetime = Field(default_factory=datetime.now)

class SessionSummary(BaseModel):
    id: str
    title: str
    updated_at: datetime

class SaveMessageRequest(BaseModel):
    session_id: Optional[str] = None
    role: str
    content: str
    type: str = 'text'
    tab: str
    sources: Optional[List[Any]] = []
    title: Optional[str] = None # To rename session if needed
