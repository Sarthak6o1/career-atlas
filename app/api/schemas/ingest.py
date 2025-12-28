from pydantic import BaseModel
from typing import List, Dict, Any
from .common import BaseResponse
class IngestBatchRequest(BaseModel):
    ids: List[str]
    documents: List[str]
    metadatas: List[Dict[str, Any]]

class IngestResult(BaseResponse):
    ids: List[str]
    count: int

class ParseResult(BaseResponse):
    text: str
    filename: str
