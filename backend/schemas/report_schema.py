from pydantic import BaseModel, Field
from typing import Optional

class IncidentReportRequest(BaseModel):
    attack: str = Field(..., description="Predicted attack category")
    confidence: float = Field(..., description="Prediction confidence score")
    severity: str = Field(..., description="Threat severity level")
    timestamp: str = Field(..., description="Timestamp of the threat detection")
    status: Optional[str] = Field(None, description="Current status of the threat")
    
    # Optional Gemini inputs; if not provided, the service will generate them automatically
    business_impact: Optional[str] = Field(None, description="AI-generated business impact")
    mitigation_steps: Optional[str] = Field(None, description="AI-generated mitigation steps")
    executive_summary: Optional[str] = Field(None, description="AI-generated executive summary")

class IncidentReportResponse(BaseModel):
    incident_id: str = Field(..., description="Unique enterprise incident identifier")
    timestamp: str = Field(..., description="Timestamp of the incident report creation")
    attack: str = Field(..., description="Type of cyber attack detected")
    severity: str = Field(..., description="Calculated threat severity")
    confidence: float = Field(..., description="Model prediction confidence percentage")
    business_impact: str = Field(..., description="Detailed business impact analysis")
    mitigation: str = Field(..., description="Immediate mitigation steps")
    recommendations: str = Field(..., description="Strategic recommendations for prevention")
    executive_summary: str = Field(..., description="Executive summary for stakeholders")
    report_markdown: str = Field(..., description="Full professional incident report formatted in Markdown")
