from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from app.services.ingest_service import IngestService, get_ingest_service
from app.api.schemas.ingest import ParseResult
from app.api.routes.auth_routes import get_current_user
from app.api.schemas.user import UserInDB
from app.core.database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/parse/resume", response_model=ParseResult)
async def parse_resume(
    file: UploadFile = File(...),
    service: IngestService = Depends(get_ingest_service),
    current_user: UserInDB = Depends(get_current_user)
):
    allowed_types = ['.pdf', '.txt', '.md', '.jpg', '.jpeg', '.png']
    MAX_FILE_SIZE = 5 * 1024 * 1024 
    
    if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
        raise HTTPException(status_code=400, detail=f"File type not supported. Allowed: {allowed_types}")
    
    try:
        contents = await file.read()
        file_size = len(contents)
        
        if file_size == 0:
             raise HTTPException(status_code=400, detail="Uploaded file is empty.")
             
        if file_size > MAX_FILE_SIZE:
             raise HTTPException(status_code=413, detail=f"File too large ({file_size/1024/1024:.2f}MB). Limit is 5MB.")

        # Parse the resume
        print(f"Parsing resume for user: {current_user.email} (ID: {current_user.id})")
        try:
            result = await service.parse_file(file, contents)
            print(f"Resume text extracted. Length: {len(result.text)}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Resume Parsing Failed: {str(e)}")

        try:
            # SAVE to MongoDB User Profile
            print("Saving to MongoDB...")
            database = db.get_db()
            update_result = await database.users.update_one(
                {"_id": ObjectId(current_user.id)},
                {"$set": {
                    "resume_text": result.text,
                    "resume_filename": file.filename,
                    "resume_updated_at": str(result.metadata.get('ingestion_date', datetime.now()))
                }}
            )
            print(f"MongoDB Update Result: Matched={update_result.matched_count}")
        except Exception as e:
            print(f"DB Save Failed: {e}")
            # Don't fail the request if save fails, but warn
            # raise HTTPException(status_code=500, detail=f"Database Save Failed: {str(e)}")
        
        return result

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")
