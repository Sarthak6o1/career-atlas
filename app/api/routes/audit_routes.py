from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.generation.llm import audit_resume_text

router = APIRouter()

class AuditRequest(BaseModel):
    resume_text: str

class AuditResult(BaseModel):
    audit_md: str

@router.post("/audit", response_model=AuditResult)
async def audit_resume_route(request: AuditRequest):
    try:
        result = audit_resume_text(request.resume_text)
        return AuditResult(audit_md=result)
    except Exception as e:
        print(f"Audit Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
