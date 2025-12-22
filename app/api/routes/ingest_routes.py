from fastapi import APIRouter, HTTPException, Depends, status
from app.api.schemas.ingest import IngestBatchRequest, IngestResult
from app.services.ingest_service import IngestService, get_ingest_service

router = APIRouter()

@router.post("/ingest/batch", status_code=status.HTTP_201_CREATED, response_model=IngestResult)
async def add_documents(
    request: IngestBatchRequest, 
    service: IngestService = Depends(get_ingest_service)
):
    try:
        return await service.batch_ingest(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
