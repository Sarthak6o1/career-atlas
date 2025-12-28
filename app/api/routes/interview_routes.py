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
from app.agents.deep_research_agent import DeepResearchAgent, get_deep_research_agent

@router.post(
    "/interview/agentic", 
    response_model=GenerationResult,
    summary="Agentic Interview Prep",
    description="Performs live web research to find recent interview questions and company intel."
)
async def get_agentic_interview_prep(
    request: GenerationRequest,
    agent: DeepResearchAgent = Depends(get_deep_research_agent)
):
    try:
        # Pure Agentic Approach: Uses live web search for fresh intel
        result = await agent.find_interview_intel_async(
            request.target_role, 
            request.target_company or "Tech Companies"
        )
        return GenerationResult(result_md=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview Agent Failed: {str(e)}")
