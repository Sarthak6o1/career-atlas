from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import db
from app.api.routes import (
    job_fit_routes, summary_routes, enhance_routes, 
    interview_routes, cover_letter_routes, upload_routes, 
    ai_assistant_routes, job_search_routes, tailor_routes,
    auth_routes, chat_routes, job_routes, audit_routes
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to DB on startup
    db.connect()
    yield
    # Disconnect on shutdown
    db.disconnect()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(job_fit_routes.router, prefix="/api", tags=["job-fit"])
app.include_router(summary_routes.router, prefix="/api", tags=["summary"])
app.include_router(enhance_routes.router, prefix="/api", tags=["enhance"])
app.include_router(interview_routes.router, prefix="/api", tags=["interview"])
app.include_router(cover_letter_routes.router, prefix="/api", tags=["cover-letter"])
app.include_router(ai_assistant_routes.router, prefix="/api/ai-assistant", tags=["ai-assistant"])
app.include_router(upload_routes.router, prefix="/api", tags=["utils"])
app.include_router(job_search_routes.router, prefix="/api", tags=["jobs"])
app.include_router(tailor_routes.router, prefix="/api", tags=["tailor"])
app.include_router(auth_routes.router, prefix="/api", tags=["auth"])

app.include_router(chat_routes.router, prefix="/api", tags=["chat"])
app.include_router(job_routes.router, prefix="/api", tags=["saved-jobs"])
app.include_router(audit_routes.router, prefix="/api", tags=["audit"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME, "db": "connected" if db.client else "disconnected"}
