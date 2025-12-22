from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.analyze import AnalyzeRequest, SummaryResult
from app.services.analyze_service import AnalyzeService, get_analyze_service

router = APIRouter()

@router.post("/summary", response_model=SummaryResult)
def get_summary(
    request: AnalyzeRequest,
    service: AnalyzeService = Depends(get_analyze_service)
):
    try:
        return service.generate_summary(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
