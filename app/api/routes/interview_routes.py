from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.generator import GenerationRequest, GenerationResult
from app.services.generator_service import GeneratorService, get_generator_service

router = APIRouter()

@router.post("/interview", response_model=GenerationResult)
def get_interview_prep(
    request: GenerationRequest,
    service: GeneratorService = Depends(get_generator_service)
):
    try:
        return service.generate_interview(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from app.retrieval.retriever import get_retriever

@router.post("/interview/agentic", response_model=GenerationResult)
def get_agentic_interview_prep(
    request: GenerationRequest,
    retriever = Depends(get_retriever)
):
    try:
        from app.services.job_search_service import JobSearchService
        
        # Hybrid Approach: Get RAG matches first
        matches = retriever.get_role_context(request.target_role, limit=3)
        
        service = JobSearchService()
        result = service.find_interview_intel(
            request.target_role, 
            request.target_company or "Tech Companies", 
            vector_matches=matches
        )
        return GenerationResult(result_md=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
