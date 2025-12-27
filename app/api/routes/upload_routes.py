from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from app.services.ingest_service import IngestService, get_ingest_service
from app.api.schemas.ingest import ParseResult

router = APIRouter()

@router.post("/parse/resume", response_model=ParseResult)
async def parse_resume(
    file: UploadFile = File(...),
    service: IngestService = Depends(get_ingest_service)
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

        return await service.parse_file(file, contents)

    except ValueError as ve:
         raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")
