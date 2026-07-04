import datetime
import random
import string
from backend.schemas.report_schema import IncidentReportRequest, IncidentReportResponse
from backend.utils.logger import logger

class ReportService:
    @staticmethod
    def generate_incident_id() -> str:
        """Generates a random unique Incident ID in the format: INC-YYYYMMDD-XXXX."""
        date_str = datetime.datetime.now().strftime("%Y%m%d")
        random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"INC-{date_str}-{random_suffix}"

    def create_report(self, request: IncidentReportRequest) -> IncidentReportResponse:
        """
        Synthesizes prediction inputs and Gemini-generated text into a highly structured
        professional security incident report in JSON and Markdown.
        """
        incident_id = self.generate_incident_id()
        report_time = datetime.datetime.now().isoformat()
        
        # Populate fallbacks if Gemini text was not provided in the request
        business_impact = request.business_impact or (
            f"Potential exposure of critical systems to {request.attack} traffic. "
            f"If successful, this could impact system availability, violate compliance standards, "
            f"and result in financial or reputational costs."
        )
        
        mitigation = request.mitigation_steps or (
            f"1. Isolate target servers immediately.\n"
            f"2. Add source IP to firewall block lists.\n"
            f"3. Audit system logs around {request.timestamp} for payload indicators."
        )
        
        # Derived recommendations based on attack category
        recommendations = (
            f"1. Apply latest vendor patches to target assets.\n"
            f"2. Enable continuous traffic monitoring on the affected subnet.\n"
            f"3. Run an internal vulnerability scan to check for exposed interfaces."
        )
        
        executive_summary = request.executive_summary or (
            f"SentinelAI detected a {request.severity}-severity {request.attack} incident. "
            f"The prediction was generated with {request.confidence}% confidence. "
            f"Recommended actions include source isolation and access control audits."
        )

        # Assemble the Markdown Report
        markdown_content = f"""# ENTERPRISE SECURITY INCIDENT REPORT: {incident_id}
**Classification**: CONFIDENTIAL - SECURITY SENSITIVE INFORMATION
**Report Date**: {datetime.datetime.fromisoformat(report_time).strftime('%Y-%m-%d %H:%M:%S')}

---

## 1. Executive Summary
{executive_summary}

## 2. Threat Profile & ML Diagnostics
The threat was identified by SentinelAI's trained XGBoost threat classifier using network traffic event diagnostics.

| Parameter | Value |
| :--- | :--- |
| **Incident ID** | `{incident_id}` |
| **Detection Timestamp** | `{request.timestamp}` |
| **Threat Classification** | `{request.attack}` |
| **Model Confidence** | `{request.confidence}%` |
| **Determined Severity** | **{request.severity}** |
| **Threat Status** | `{request.status or "Threat Detected"}` |

## 3. Business Impact Analysis
{business_impact}

## 4. Immediate Mitigation Plan (Active Response)
{mitigation}

## 5. Strategic Recommendations & Prevention
{recommendations}

---
*Report generated automatically by SentinelAI Cyber Threat Intelligence Dashboard.*
"""

        logger.info(f"Generated incident report {incident_id} for attack type: {request.attack}")

        return IncidentReportResponse(
            incident_id=incident_id,
            timestamp=report_time,
            attack=request.attack,
            severity=request.severity,
            confidence=request.confidence,
            business_impact=business_impact,
            mitigation=mitigation,
            recommendations=recommendations,
            executive_summary=executive_summary,
            report_markdown=markdown_content.strip()
        )

_report_service = None

def get_report_service() -> ReportService:
    global _report_service
    if _report_service is None:
        _report_service = ReportService()
    return _report_service
