from pydantic import BaseModel, Field
from typing import Optional

class BaseResponse(BaseModel):
    success: bool = Field(True, description="Operation status flag")
    message: Optional[str] = Field(None, description="Optional status message or error details")
