from pydantic import BaseModel
from .common import BaseResponse

class EnhanceRequest(BaseModel):
    resume_text: str
    target_role: str | None = None
    target_company: str | None = None

class EnhanceResult(BaseResponse):
    enhancement_md: str
