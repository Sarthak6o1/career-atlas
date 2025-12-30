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
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "career_atlas_db"
    SECRET_KEY: str = "supersecret_jwt_key_mostly_for_dev_7283"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
