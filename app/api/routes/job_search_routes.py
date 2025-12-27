from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.job_search_service import JobSearchService, get_job_search_service
from app.retrieval.retriever import get_retriever

router = APIRouter()

class JobSearchRequest(BaseModel):
    resume_text: str
    target_role: str
    location: str | None = None
    job_type: str | None = None
    experience_level: str | None = None

class JobSearchResult(BaseModel):
    result_md: str

@router.post("/find-jobs", response_model=JobSearchResult)
def find_jobs(
    request: JobSearchRequest,
    service: JobSearchService = Depends(get_job_search_service),
    retriever = Depends(get_retriever)
):
    try:
        # Pure Agentic Approach: No Vector/RAG context
        result = service.find_jobs(
            request.resume_text, 
            request.target_role, 
            vector_matches=None, 
            location=request.location,
            job_type=request.job_type,
            experience_level=request.experience_level
        )
        return JobSearchResult(result_md=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
