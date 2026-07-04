from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PredictionResponse(BaseModel):
    attack: str = Field(..., description="Predicted cyber attack category")
    confidence: float = Field(..., description="Model prediction confidence percentage (0-100)")
    severity: str = Field(..., description="Determined threat severity (Critical, High, Medium, Low)")
    timestamp: str = Field(..., description="ISO 8601 formatted timestamp of prediction")
    status: str = Field(..., description="Overall threat status description")

class GeminiAnalysisRequest(BaseModel):
    attack: str = Field(..., description="Predicted cyber attack category")
    confidence: float = Field(..., description="Model prediction confidence percentage (0-100)")
    severity: str = Field(..., description="Determined threat severity (Critical, High, Medium, Low)")
    timestamp: str = Field(..., description="ISO 8601 formatted timestamp of prediction")

class MitigationDetails(BaseModel):
    immediate_actions: str = Field(..., description="Immediate technical actions to secure systems")
    long_term_recommendations: str = Field(..., description="Long-term architectural and preventative recommendations")

class GeminiAnalysisResponse(BaseModel):
    threat_explanation: str = Field(..., description="Technical description of the threat vector")
    business_impact: str = Field(..., description="Potential financial, reputation, and operational impacts")
    technical_analysis: str = Field(..., description="In-depth technical behavior analysis of the attack category")
    risk_assessment: str = Field(..., description="Vulnerability level, risk likelihood, and threat capability score")
    mitigation: MitigationDetails = Field(..., description="Actionable immediate and strategic mitigation steps")
    executive_summary: str = Field(..., description="High-level incident summary suitable for leadership and compliance auditing")

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender: 'user' or 'model'")
    content: str = Field(..., description="Text content of the message")

class ChatRequest(BaseModel):
    question: str = Field(..., description="User question to Gemini")
    history: List[ChatMessage] = Field(default=[], description="Previous conversation history")

class ChatResponse(BaseModel):
    response: str = Field(..., description="Gemini response to the question")
    history: List[ChatMessage] = Field(..., description="Updated conversation history including user question and model response")
