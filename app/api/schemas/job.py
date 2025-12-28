from pydantic import BaseModel, Field

class JobSearchRequest(BaseModel):
    resume_text: str = Field(..., description="Full text content of the candidate's resume")
    target_role: str = Field(..., description="The specific job role to search for (e.g. 'Senior Product Manager')")
    location: str | None = Field(None, description="Preferred location strictly for search filtering (e.g. 'Remote', 'New York')")
    job_type: str | None = Field(None, description="Employment type (Full-time, Contract, etc.)")
    experience_level: str | None = Field(None, description="Years of experience or level (Junior, Senior, etc.)")

class JobSearchResult(BaseModel):
    result_md: str = Field(..., description="Markdown formatted report containing job listings and analysis")
