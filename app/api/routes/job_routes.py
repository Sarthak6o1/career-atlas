from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.api.schemas.job_schema import Job, JobCreate, JobUpdate
from app.api.schemas.user import UserInDB
from app.api.routes.auth_routes import get_current_user
from app.core.database import db
from datetime import datetime
import uuid
from bson import ObjectId

router = APIRouter()

@router.post("/jobs", response_model=Job)
async def save_job(job_in: JobCreate, current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    
    job_data = job_in.dict()
    job_id = str(uuid.uuid4())
    
    new_job = {
        "id": job_id,
        "user_id": current_user.id,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        **job_data
    }
    
    await database.jobs.insert_one(new_job)
    return new_job

@router.get("/jobs", response_model=List[Job])
async def get_jobs(current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    cursor = database.jobs.find({"user_id": current_user.id}).sort("created_at", -1)
    jobs = await cursor.to_list(length=100)
    return jobs

@router.patch("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: str, job_update: JobUpdate, current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    
    update_data = {k: v for k, v in job_update.dict(exclude_unset=True).items()}
    update_data["updated_at"] = datetime.now()
    
    result = await database.jobs.find_one_and_update(
        {"id": job_id, "user_id": current_user.id},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return result

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, current_user: UserInDB = Depends(get_current_user)):
    database = db.get_db()
    result = await database.jobs.delete_one({"id": job_id, "user_id": current_user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {"status": "deleted", "id": job_id}
