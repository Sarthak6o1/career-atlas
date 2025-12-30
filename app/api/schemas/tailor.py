from pydantic import BaseModel, Field

class TailorRequest(BaseModel):
    resume_text: str = Field(..., description="The user's current resume content")
    job_description: str = Field(..., description="The target job description text")
    
class TailorResult(BaseModel):
    tailored_content: str = Field(..., description="The rewritten resume content in Markdown")
    diff_analysis: str = Field(..., description="Explanation of what was changed and why")
