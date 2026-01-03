from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.api.schemas.conversation import Message, Conversation, SaveMessageRequest, SessionSummary
from app.api.schemas.user import UserInDB
from app.api.routes.auth_routes import get_current_user
from app.core.database import db
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/chat/sessions", response_model=List[SessionSummary])
async def get_sessions(current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    cursor = database.conversations.find(
        {"user_id": current_user.id},
        {"messages": 0, "_id": 0} 
    ).sort("updated_at", -1)
    
    sessions = []
    async for doc in cursor:
        if "session_id" in doc:
             sessions.append(SessionSummary(
                id=doc["session_id"],
                title=doc.get("title", "Untitled Session"),
                updated_at=doc.get("updated_at", datetime.now())
             ))
    return sessions

@router.get("/chat/history", response_model=List[Message])
async def get_chat_history(
    session_id: Optional[str] = Query(None),
    current_user: UserInDB = Depends(get_current_user)
):
    database = db.get_db()
    
    query = {"user_id": current_user.id}
    if session_id:
        query["session_id"] = session_id
        doc = await database.conversations.find_one(query)
    else:
        # Get most recent
        cursor = database.conversations.find(query).sort("updated_at", -1).limit(1)
        docs = await cursor.to_list(length=1)
        doc = docs[0] if docs else None
    
    if not doc:
        return []
    
    return doc.get("messages", [])

@router.post("/chat/message")
async def save_message(
    msg_data: SaveMessageRequest, 
    current_user: UserInDB = Depends(get_current_user)
):
    database = db.get_db()
    
    sid = msg_data.session_id
    if not sid:
        sid = str(uuid.uuid4())
    
    new_message = Message(
        id=str(uuid.uuid4()),
        role=msg_data.role,
        content=msg_data.content,
        type=msg_data.type,
        tab=msg_data.tab,
        timestamp=datetime.now(),
        sources=msg_data.sources
    )
    
    # Upsert with session_id
    await database.conversations.update_one(
        {"session_id": sid, "user_id": current_user.id},
        {
            "$push": {"messages": new_message.dict()},
            "$set": {"updated_at": datetime.now()},
            "$setOnInsert": {
                "title": msg_data.title or "New Session", 
                "created_at": datetime.now(),
                "session_id": sid 
            }
        },
        upsert=True
    )
    
    return {"status": "saved", "message_id": new_message.id, "session_id": sid}

from pydantic import BaseModel
class SessionUpdate(BaseModel):
    title: Optional[str] = None
    resume_text: Optional[str] = None
    filename: Optional[str] = None

@router.get("/chat/sessions/{session_id}")
async def get_session_details(session_id: str, current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    doc = await database.conversations.find_one({"session_id": session_id, "user_id": current_user.id})
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found")
    
    doc.pop("_id", None)
    return doc

@router.put("/chat/sessions/{session_id}")
async def update_session(session_id: str, body: SessionUpdate, current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    
    update_data = {}
    if body.title: update_data["title"] = body.title
    if body.resume_text: update_data["resume_text"] = body.resume_text
    if body.filename: update_data["filename"] = body.filename
    
    if not update_data:
        return {"status": "no_change"}
        
    await database.conversations.update_one(
        {"session_id": session_id, "user_id": current_user.id},
        {
            "$set": {**update_data, "updated_at": datetime.now()},
            "$setOnInsert": {"created_at": datetime.now(), "messages": []}
        },
        upsert=True
    )
    return {"status": "updated"}

@router.delete("/chat/sessions/{session_id}")
async def delete_session(session_id: str, current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    await database.conversations.delete_one({"session_id": session_id, "user_id": current_user.id})
    return {"status": "deleted"}

@router.delete("/chat/history")
async def clear_chat_history(current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    await database.conversations.delete_many({"user_id": current_user.id})
    return {"status": "cleared"}
