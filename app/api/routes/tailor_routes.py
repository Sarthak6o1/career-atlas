from fastapi import APIRouter, Depends, HTTPException
from app.api.schemas.tailor import TailorRequest, TailorResult
from app.services.tailor_service import TailorService, get_tailor_service

router = APIRouter()

@router.post(
    "/tailor",
    response_model=TailorResult,
    summary="Smart Resume Tailor",
    description="Rewrites resume bullet points to match a specific Job Description."
)
async def tailor_resume(
    request: TailorRequest,
    service: TailorService = Depends(get_tailor_service)
):
    try:
        return await service.tailor_resume_async(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tailoring Failed: {str(e)}")
