# SentinelAI - Cyber Threat Intelligence Dashboard Backend

Enterprise SOC security log machine learning model inference and Google Gemini intelligence analysis backend built with FastAPI, Pandas, XGBoost, and Google Gen AI SDK.

## Features
- **FastAPI Core**: Highly scalable, asynchronous backend with automatic Swagger UI documentation.
- **XGBoost Inference**: Loads a trained classification model to detect cyber attacks with confidence diagnostics.
- **Categorical Preprocessing**: Applies ordinal encoding pipelines natively mapping incoming web request metrics.
- **Google Gemini Analysis**: Generates professional explanations, business impacts, risk levels, and mitigation steps.
- **Incident Reporting**: Formulates professional, downloadable markdown incident reports with unique enterprise IDs.
- **Robust Mock Mode**: Runs seamlessly in mock mode if the Gemini API Key is unconfigured, making testing and hackathon judging smooth.
- **Structured Tracing**: Implements context-based request correlation IDs for clear, audit-ready stdout tracing.

---

## Directory Structure

```
backend/
├── app.py                  # Entrypoint, CORS, Middleware, Lifespan loading
├── requirements.txt        # Python dependency locking (XGBoost 2.0.3 locked)
├── .env                    # Environment configurations
├── README.md               # Backend documentation
│
├── models/                 # Model assets (loaded once at startup)
│   ├── cyber_threat_model.pkl
│   ├── feature_encoder.pkl
│   ├── target_encoder.pkl
│   └── feature_names.pkl
│
├── routers/                # Sub-route files
│   ├── health.py           # GET /health - system health and connection diagnostic
│   ├── prediction.py       # POST /predict - CSV parser & inference pipeline
│   ├── gemini.py           # POST /gemini-analysis & POST /chat - LLM interactions
│   └── report.py           # POST /incident-report - markdown document compiler
│
├── services/               # Reusable business logic layers
│   ├── ml_service.py       # Loads XGBoost and runs inference/confidence calculations
│   ├── gemini_service.py   # Connects to Gemini API or invokes Mock fallbacks
│   └── report_service.py   # Synthesizes parameters into Markdown report
│
├── schemas/                # Pydantic input/output validation models
│   ├── prediction_schema.py
│   └── report_schema.py
│
├── utils/                  # Helper modules
│   ├── preprocessing.py    # Reads, checks columns, cleans and ordinal encodes CSV bytes
│   └── logger.py           # Configures structured logger with ContextVar request-id
│
└── uploads/                # Directory containing uploaded audit logs
```

---

## Getting Started

### Prerequisites
- Python 3.10+ (Recommended Python 3.14 compatible)
- Google Gemini API Key (Optional; falls back to Mock simulation if omitted)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure your environment variables in `.env`:
   - Duplicate the default configuration:
     ```env
     # Google Gemini API Configuration
     GEMINI_API_KEY=YOUR_GEMINI_API_KEY
     ```

---

## Running the Server

Start the development server using Uvicorn:
```bash
python app.py
```
Or run directly through Uvicorn:
```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

The API endpoints will be accessible at `http://127.0.0.1:8000`.
You can view the interactive Swagger API documentation at `http://127.0.0.1:8000/docs`.

---

## API Endpoints Summary

### General & Health
- **`GET /`**: Verify backend running status.
- **`GET /health`**: Retrieve service diagnostics including whether the machine learning models loaded successfully and Gemini connection status.

### Inference & Threat intelligence
- **`POST /predict`**: Accepts a CSV security log under form-data key `file`. Preprocesses the data, runs the XGBoost model on the log event, and determines the attack category, prediction confidence, and severity.
- **`POST /gemini-analysis`**: Submits attack category, confidence, and severity details to Gemini, returning a structured JSON payload containing threat explanations, business impacts, risk levels, and mitigation steps.
- **`POST /chat`**: Takes a user message and discussion history to simulate an active analyst-assistant conversation thread.
- **`POST /incident-report`**: Creates an official corporate security incident report with a unique ticket ID. Returns JSON metadata and a professional markdown document layout.
