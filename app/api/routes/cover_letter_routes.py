from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.generator import GenerationRequest, GenerationResult
from app.services.generator_service import GeneratorService, get_generator_service

router = APIRouter()

@router.post("/cover-letter", response_model=GenerationResult)
async def get_cover_letter(
    request: GenerationRequest,
    service: GeneratorService = Depends(get_generator_service)
):
    try:
        return await service.generate_letter_async(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
