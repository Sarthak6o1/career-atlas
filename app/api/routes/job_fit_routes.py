from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.analyze import AnalyzeRequest, JobFitResult
from app.services.analyze_service import AnalyzeService, get_analyze_service

router = APIRouter()

@router.post("/job-fit", response_model=JobFitResult)
def analyze_job_fit(
    request: AnalyzeRequest,
    service: AnalyzeService = Depends(get_analyze_service)
):
    try:
        return service.analyze_fit(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
