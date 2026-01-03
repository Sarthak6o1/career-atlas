from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.job_schema import JobSearchRequest, JobSearchResult
from app.agents.deep_research_agent import DeepResearchAgent, get_deep_research_agent
from app.retrieval.retriever import get_retriever

router = APIRouter()

@router.post(
    "/find-jobs", 
    response_model=JobSearchResult,
    summary="Agentic Job Search",
    description="Uses an AI Agent to search for live job listings matching the user's resume and criteria."
)
async def find_jobs(
    request: JobSearchRequest,
    agent: DeepResearchAgent = Depends(get_deep_research_agent),
    retriever = Depends(get_retriever)
):
    """
    Executes a multi-step agentic search:
    1. Analyzes resume for keywords.
    2. Performs live web searches.
    3. Synthesizes a report with Apply Links.
    """
    try:
        # Pure Agentic Approach: No Vector/RAG context needed for *search* mainly, but available
        result = await agent.find_jobs_async(
            request.resume_text, 
            request.target_role, 
            location=request.location,
            job_type=request.job_type,
            experience_level=request.experience_level
        )
        return JobSearchResult(result_md=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job Search Failed: {str(e)}")
