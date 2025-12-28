from pydantic import BaseModel, Field
from typing import List
from .common import BaseResponse

class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., description="Resume content to analyze")
    limit: int = Field(5, description="Number of similar market profiles to retrieve for context")

class JobFitResult(BaseResponse):
    summary_analysis: str = Field(..., description="LLM generated analysis of candidate fit")
    top_matches: List[dict] = Field(..., description="List of similar career profiles found in database")

class SummaryResult(BaseResponse):
    summary_md: str = Field(..., description="Professional executive summary in Markdown")
