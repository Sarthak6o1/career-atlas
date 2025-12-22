from pydantic import BaseModel
from typing import List, Optional, Any

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
