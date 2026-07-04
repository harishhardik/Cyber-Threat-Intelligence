from fastapi import APIRouter, Depends, HTTPException, status
from backend.services.report_service import get_report_service, ReportService
from backend.schemas.report_schema import IncidentReportRequest, IncidentReportResponse
from backend.utils.logger import logger

router = APIRouter(prefix="/incident-report", tags=["Incident Reports"])

@router.post("", response_model=IncidentReportResponse)
async def generate_incident_report(
    payload: IncidentReportRequest,
    report_service: ReportService = Depends(get_report_service)
):
    """
    Accepts prediction outputs and optional threat analysis parameters to compile 
    a professional Incident Report, assigning a unique Incident ID and producing 
    both a structured JSON response and a detailed Markdown document.
    """
    logger.info(f"Generating incident report for threat category: {payload.attack}")
    try:
        report = report_service.create_report(payload)
        return report
    except Exception as e:
        logger.error(f"Incident report generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate incident report: {str(e)}"
        )
