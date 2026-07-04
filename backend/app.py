import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add parent directory of backend/ to sys.path to resolve packages correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables first
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from backend.utils.logger import logger, set_request_id
from backend.services.ml_service import get_ml_service
from backend.services.gemini_service import get_gemini_service
from backend.routers import health, prediction, gemini, report

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the FastAPI application lifespan.
    Caches model loads and connection initialization on startup.
    """
    logger.info("Initializing SentinelAI Backend Lifespan...")
    try:
        # Pre-load ML models and encoders
        get_ml_service()
        # Initialize Gemini API configuration
        get_gemini_service()
        logger.info("SentinelAI Backend initialization successful.")
    except Exception as e:
        logger.error(f"Error during SentinelAI Backend startup initialization: {str(e)}")
        # We do not crash the server in case of missing Gemini API key to let health checks run
    yield
    logger.info("Shutting down SentinelAI Backend...")

app = FastAPI(
    title="SentinelAI - Cyber Threat Intelligence Dashboard API",
    description="Enterprise SOC platform machine learning model inference and Gemini analysis backend.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# Retrieve origins from environment variables or use default local development host
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request ID & Tracing Middleware
@app.middleware("http")
async def context_logger_middleware(request: Request, call_next):
    # Set request ID from headers or generate new one
    req_id = request.headers.get("X-Request-ID")
    set_request_id(req_id)
    
    # Process request
    response = await call_next(request)
    
    # Attach request ID to response headers
    response.headers["X-Request-ID"] = set_request_id()
    return response

# Register Application Routers
app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(gemini.router)
app.include_router(report.router)

@app.get("/")
async def root():
    """Root route returning server health/identity."""
    return {
        "status": "running",
        "project": "SentinelAI"
    }

if __name__ == "__main__":
    import uvicorn
    # Allow running this file directly for development
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app:app", host=host, port=port, reload=True)
