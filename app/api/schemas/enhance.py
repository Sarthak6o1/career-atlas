from pydantic import BaseModel, Field
from .common import BaseResponse

class EnhanceRequest(BaseModel):
    resume_text: str = Field(..., description="Current resume content")
    target_role: str | None = Field(None, description="Role to optimize for (defaults to general enhancement)")
    target_company: str | None = Field(None, description="Company to target (optional)")

class EnhanceResult(BaseResponse):
    enhancement_md: str = Field(..., description="Strategic advice and keyword enhancements in Markdown")
