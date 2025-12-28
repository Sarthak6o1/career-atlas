from pydantic import BaseModel, Field
from .common import BaseResponse

class GenerationRequest(BaseModel):
    resume_text: str = Field(..., description="The user's resume content to analyze")
    target_role: str | None = Field(None, description="Target job title to tailor the content for")
    target_company: str | None = Field(None, description="Specific company name for context")

class GenerationResult(BaseResponse):
    result_md: str = Field(..., description="Generated content in styled Markdown format")
