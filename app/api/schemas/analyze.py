from pydantic import BaseModel
from typing import List
from .common import BaseResponse

class AnalyzeRequest(BaseModel):
    resume_text: str
    limit: int = 5

class JobFitResult(BaseResponse):
    summary_analysis: str
    top_matches: List[dict]

class SummaryResult(BaseResponse):
    summary_md: str
