from fastapi import APIRouter, Depends, HTTPException, status
from backend.services.gemini_service import get_gemini_service, GeminiService
from backend.schemas.prediction_schema import (
    GeminiAnalysisRequest, 
    GeminiAnalysisResponse,
    ChatRequest,
    ChatResponse
)
from backend.utils.logger import logger

router = APIRouter(tags=["Gemini AI Operations"])

@router.post("/gemini-analysis", response_model=GeminiAnalysisResponse)
async def generate_threat_analysis(
    payload: GeminiAnalysisRequest,
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """
    Submits threat prediction coordinates to Google Gemini to compile a detailed,
    structured security intelligence report (Explanation, Business Impact, Risk, Mitigation, Executive Summary).
    """
    logger.info(f"Generating Gemini threat intelligence analysis for attack category: {payload.attack}")
    try:
        analysis = gemini_service.analyze_threat(
            attack=payload.attack,
            confidence=payload.confidence,
            severity=payload.severity,
            timestamp=payload.timestamp
        )
        return analysis
    except Exception as e:
        logger.error(f"Failed to generate Gemini threat analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gemini service was unable to complete the request: {str(e)}"
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_assistant(
    payload: ChatRequest,
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """
    Enterprise Threat Analyst chatbot. Accepts a user query and maintains
    conversation history to assist SOC analysts in investigations.
    """
    logger.info(f"Chat request received. Message: '{payload.question[:40]}...'")
    try:
        response_text, updated_history = gemini_service.chat(
            question=payload.question,
            history=payload.history
        )
        return ChatResponse(
            response=response_text,
            history=updated_history
        )
    except Exception as e:
        logger.error(f"Chat assistant failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat assistant encountered an error: {str(e)}"
        )
