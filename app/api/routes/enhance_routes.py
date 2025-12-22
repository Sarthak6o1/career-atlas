from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.enhance import EnhanceRequest, EnhanceResult
from app.services.enhance_service import EnhanceService, get_enhance_service

router = APIRouter()

@router.post("/enhance", response_model=EnhanceResult)
def suggest_enhancements(
    request: EnhanceRequest,
    service: EnhanceService = Depends(get_enhance_service)
):
    try:
        return service.suggest_enhancements(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
