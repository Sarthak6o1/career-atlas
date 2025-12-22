from pydantic import BaseModel
from .common import BaseResponse

class GenerationRequest(BaseModel):
    resume_text: str
    target_role: str | None = None
    target_company: str | None = None

class GenerationResult(BaseResponse):
    result_md: str
