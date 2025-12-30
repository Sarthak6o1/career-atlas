from app.generation.llm import tailor_resume
from app.api.schemas.tailor import TailorRequest, TailorResult
from starlette.concurrency import run_in_threadpool

class TailorService:
    async def tailor_resume_async(self, request: TailorRequest) -> TailorResult:
        result_md = await run_in_threadpool(tailor_resume, request.resume_text, request.job_description)
        
        # Simple string splitting to separate content from analysis (Heuristic based on our Prompt structure)
        # In a real app, we might ask LLM to output JSON, but splitting MD is faster/cheaper for now.
        parts = result_md.split("### 💡 Strategic Explanation")
        
        content = parts[0]
        analysis = "### 💡 Strategic Explanation" + parts[1] if len(parts) > 1 else "Analysis included in content."
        
        return TailorResult(
            tailored_content=content,
            diff_analysis=analysis
        )

def get_tailor_service() -> TailorService:
    return TailorService()
