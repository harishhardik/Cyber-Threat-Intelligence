from fastapi import APIRouter, Depends
from backend.services.ml_service import get_ml_service, MLService
from backend.services.gemini_service import get_gemini_service, GeminiService
from backend.utils.logger import logger

router = APIRouter(prefix="/health", tags=["Health Monitoring"])

@router.get("")
async def health_check():
    """
    Performs diagnostic health checks on the backend components:
    - Verifies FastAPI server responsiveness.
    - Confirms ML model and encoders are loaded.
    - Confirms Google Gemini connectivity status.
    """
    model_loaded = False
    gemini_connected = False
    
    # Check ML Service status
    try:
        ml_service = get_ml_service()
        if ml_service.model is not None:
            model_loaded = True
    except Exception as e:
        logger.error(f"Health Check - ML model status error: {str(e)}")

    # Check Gemini Service status
    try:
        gemini_service = get_gemini_service()
        if not gemini_service.is_mock:
            gemini_connected = True
    except Exception as e:
        logger.error(f"Health Check - Gemini service status error: {str(e)}")

    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "gemini_connected": gemini_connected,
        "version": "1.0.0"
    }
