from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard Telemetry"])

DASHBOARD_DATA = {
    "metrics": {
        "totalThreats": { "count": 1482, "increase": 12.4, "trend": [40, 50, 45, 60, 55, 70, 85, 80, 95] },
        "criticalThreats": { "count": 34, "increase": 5.2, "trend": [2, 4, 3, 5, 4, 6, 7, 5, 8] },
        "highSeverity": { "count": 189, "increase": -2.1, "trend": [20, 18, 22, 19, 17, 21, 25, 23, 20] },
        "mediumSeverity": { "count": 456, "increase": 8.7, "trend": [30, 35, 32, 40, 38, 42, 45, 48, 52] },
        "lowSeverity": { "count": 803, "increase": 15.1, "trend": [60, 65, 70, 75, 80, 85, 90, 95, 102] },
        "resolvedThreats": { "count": 1294, "increase": 14.2, "trend": [35, 42, 40, 55, 50, 68, 80, 78, 92] }
    },
    "charts": {
        "threatDistribution": [
            { "name": "Phishing", "value": 420, "color": "#3B82F6" },
            { "name": "Malware", "value": 310, "color": "#EF4444" },
            { "name": "SQL Injection", "value": 240, "color": "#F59E0B" },
            { "name": "DDoS", "value": 180, "color": "#10B981" },
            { "name": "Brute Force", "value": 152, "color": "#8B5CF6" },
            { "name": "Others", "value": 180, "color": "#6B7280" }
        ],
        "attackTimeline": [
            { "time": "00:00", "threats": 12, "critical": 1 },
            { "time": "03:00", "threats": 8, "critical": 0 },
            { "time": "06:00", "threats": 15, "critical": 2 },
            { "time": "09:00", "threats": 45, "critical": 4 },
            { "time": "12:00", "threats": 62, "critical": 5 },
            { "time": "15:00", "threats": 55, "critical": 3 },
            { "time": "18:00", "threats": 38, "critical": 2 },
            { "time": "21:00", "threats": 24, "critical": 1 }
        ],
        "threatSeverity": [
            { "name": "Mon", "Critical": 4, "High": 15, "Medium": 35, "Low": 60 },
            { "name": "Tue", "Critical": 2, "High": 18, "Medium": 42, "Low": 72 },
            { "name": "Wed", "Critical": 5, "High": 22, "Medium": 39, "Low": 68 },
            { "name": "Thu", "Critical": 7, "High": 25, "Medium": 48, "Low": 85 },
            { "name": "Fri", "Critical": 3, "High": 20, "Medium": 52, "Low": 90 },
            { "name": "Sat", "Critical": 1, "High": 10, "Medium": 25, "Low": 40 },
            { "name": "Sun", "Critical": 2, "High": 8, "Medium": 22, "Low": 35 }
        ],
        "confidenceScores": [
            { "range": "50-60%", "count": 120 },
            { "range": "60-70%", "count": 240 },
            { "range": "70-80%", "count": 380 },
            { "range": "80-90%", "count": 520 },
            { "range": "90-100%", "count": 222 }
        ],
        "dailyActivity": [
            { "day": "Day 1", "active": 110, "resolved": 90 },
            { "day": "Day 2", "active": 125, "resolved": 105 },
            { "day": "Day 3", "active": 140, "resolved": 115 },
            { "day": "Day 4", "active": 135, "resolved": 130 },
            { "day": "Day 5", "active": 155, "resolved": 140 },
            { "day": "Day 6", "active": 120, "resolved": 125 },
            { "day": "Day 7", "active": 95, "resolved": 110 }
        ],
        "topCategories": [
            { "category": "Credential Access", "count": 310 },
            { "category": "Initial Access", "count": 280 },
            { "category": "Execution", "count": 240 },
            { "category": "Persistence", "count": 190 },
            { "category": "Exfiltration", "count": 150 },
            { "category": "Defense Evasion", "count": 120 }
        ]
    },
    "threats": [
        { "id": "TR-8902", "attackType": "SQL Injection", "severity": "Critical", "confidence": 0.98, "status": "Active", "timestamp": "2026-07-04 11:15:22" },
        { "id": "TR-8903", "attackType": "Phishing Campaign", "severity": "High", "confidence": 0.94, "status": "Investigating", "timestamp": "2026-07-04 11:08:45" },
        { "id": "TR-8904", "attackType": "Ransomware Payload", "severity": "Critical", "confidence": 0.97, "status": "Active", "timestamp": "2026-07-04 10:52:10" },
        { "id": "TR-8905", "attackType": "Brute Force SSH", "severity": "Medium", "confidence": 0.89, "status": "Resolved", "timestamp": "2026-07-04 10:30:15" },
        { "id": "TR-8906", "attackType": "DDoS SYN Flood", "severity": "High", "confidence": 0.91, "status": "Investigating", "timestamp": "2026-07-04 09:45:00" },
        { "id": "TR-8907", "attackType": "XSS Injection", "severity": "Medium", "confidence": 0.85, "status": "Resolved", "timestamp": "2026-07-04 09:12:33" },
        { "id": "TR-8908", "attackType": "Port Scanning API", "severity": "Low", "confidence": 0.76, "status": "Resolved", "timestamp": "2026-07-04 08:30:12" },
        { "id": "TR-8909", "attackType": "Data Exfiltration HTTP", "severity": "High", "confidence": 0.93, "status": "Active", "timestamp": "2026-07-04 08:15:00" },
        { "id": "TR-8910", "attackType": "DNS Tunneling", "severity": "High", "confidence": 0.87, "status": "Investigating", "timestamp": "2026-07-04 07:44:21" },
        { "id": "TR-8911", "attackType": "Credential Stuffing", "severity": "Medium", "confidence": 0.82, "status": "Resolved", "timestamp": "2026-07-04 06:12:05" }
    ]
}

@router.get("")
async def get_dashboard():
    """Returns baseline telemetry dataset."""
    return DASHBOARD_DATA
