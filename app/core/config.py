from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Career Atlas"
    GEMINI_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    CHROMA_API_KEY: str | None = None
    CHROMA_TENANT: str | None = "default_tenant"
    CHROMA_DATABASE: str | None = "default_database"
    LOG_LEVEL: str = "INFO"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
