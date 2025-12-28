from pydantic import BaseModel, Field
from typing import List, Dict, Any
from .common import BaseResponse

class IngestBatchRequest(BaseModel):
    ids: List[str] = Field(..., description="List of unique document IDs")
    documents: List[str] = Field(..., description="List of text content strings to embed")
    metadatas: List[Dict[str, Any]] = Field(..., description="List of metadata dictionaries corresponding to documents")

class IngestResult(BaseResponse):
    ids: List[str] = Field(..., description="IDs of successfully ingested items")
    count: int = Field(..., description="Total number of items processed")

class ParseResult(BaseResponse):
    text: str = Field(..., description="Extracted text content from the file")
    filename: str = Field(..., description="Original filename")
