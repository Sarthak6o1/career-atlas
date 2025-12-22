from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.analyze import AnalyzeRequest, JobFitResult, SummaryResult
from app.services.analyze_service import AnalyzeService, get_analyze_service

router = APIRouter()

@router.post("/analyze/job-fit", response_model=JobFitResult)
async def analyze_job_fit(
    request: AnalyzeRequest,
    service: AnalyzeService = Depends(get_analyze_service)
):
    try:
        return await service.analyze_fit(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/summary", response_model=SummaryResult)
async def get_summary(
    request: AnalyzeRequest,
    service: AnalyzeService = Depends(get_analyze_service)
):
    try:
        return await service.generate_summary(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
