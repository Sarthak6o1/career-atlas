from app.retrieval.retriever import Retriever, get_retriever
from app.generation.llm import get_job_fit_analysis, generate_resume_summary
from app.api.schemas.analyze import AnalyzeRequest, JobFitResult, SummaryResult
from fastapi import Depends
from starlette.concurrency import run_in_threadpool

class AnalyzeService:
    def __init__(self, retriever: Retriever):
        self.retriever = retriever

    async def analyze_fit_async(self, request: AnalyzeRequest) -> JobFitResult:
        return await run_in_threadpool(self.analyze_fit, request)

    async def generate_summary_async(self, request: AnalyzeRequest) -> SummaryResult:
        return await run_in_threadpool(self.generate_summary, request)

    def analyze_fit(self, request: AnalyzeRequest) -> JobFitResult:
        matches = self.retriever.get_similar_profiles(request.resume_text, limit=request.limit)
        analysis = get_job_fit_analysis(request.resume_text, matches)
        return JobFitResult(
            summary_analysis=analysis,
            top_matches=matches
        )

    def generate_summary(self, request: AnalyzeRequest) -> SummaryResult:
        similar_profiles = self.retriever.get_similar_profiles(request.resume_text, limit=3)
        summary = generate_resume_summary(request.resume_text, similar_profiles)
        return SummaryResult(summary_md=summary)

def get_analyze_service(retriever: Retriever = Depends(get_retriever)) -> AnalyzeService:
    return AnalyzeService(retriever)
