from app.retrieval.retriever import Retriever, get_retriever
from app.generation.llm import enhance_resume_text
from app.api.schemas.enhance import EnhanceRequest, EnhanceResult
from fastapi import Depends
from starlette.concurrency import run_in_threadpool

class EnhanceService:
    def __init__(self, retriever: Retriever):
        self.retriever = retriever

    async def suggest_enhancements_async(self, request: EnhanceRequest) -> EnhanceResult:
        return await run_in_threadpool(self.suggest_enhancements, request)

    def suggest_enhancements(self, request: EnhanceRequest) -> EnhanceResult:
        matches = self.retriever.get_role_context(request.target_role, limit=5)
        result = enhance_resume_text(request.resume_text, request.target_role, request.target_company, matches)
        return EnhanceResult(enhancement_md=result)

def get_enhance_service(retriever: Retriever = Depends(get_retriever)) -> EnhanceService:
    return EnhanceService(retriever)
