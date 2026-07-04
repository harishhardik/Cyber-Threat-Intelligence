import datetime
import os
import time
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from backend.services.ml_service import get_ml_service, MLService
from backend.utils.preprocessing import preprocess_csv
from backend.utils.logger import logger, get_request_id
from backend.schemas.prediction_schema import PredictionResponse

router = APIRouter(prefix="/predict", tags=["ML Predictions"])

@router.post("", response_model=PredictionResponse)
async def predict_security_log(
    file: UploadFile = File(..., description="Security logs in CSV format"),
    ml_service: MLService = Depends(get_ml_service)
):
    """
    Accepts a security log CSV file via multipart/form-data upload.
    Validates, preprocesses, encodes categorical features, and runs ML prediction
    to classify the attack category, confidence score, and severity level.
    """
    request_id = get_request_id()
    filename = file.filename or "unknown.csv"
    logger.info(f"Received file upload request. Filename: {filename}")

    # Validate file extension
    if not filename.endswith('.csv'):
        logger.error(f"Invalid file type uploaded: {filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only CSV files are supported."
        )

    start_time = time.time()
    
    try:
        # Read uploaded file content
        content = await file.read()
        
        # Save file to uploads folder for auditing/reproducibility
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        uploads_dir = os.path.join(current_dir, "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        
        saved_filepath = os.path.join(uploads_dir, f"{request_id}_{filename}")
        with open(saved_filepath, "wb") as f:
            f.write(content)
        logger.info(f"Audited upload saved to: {saved_filepath}")

        # Run preprocessing
        df_processed, df_raw = preprocess_csv(
            file_bytes=content,
            required_features=ml_service.get_feature_names(),
            feature_encoder=ml_service.get_feature_encoder()
        )

        if df_processed.empty:
            raise ValueError("CSV contains no data rows.")

        # Run ML prediction on the first row
        attack, confidence, severity = ml_service.predict_first_row(df_processed)

        # Retrieve or generate timestamp
        log_timestamp = None
        # Check standard timestamp column names
        timestamp_cols = ["timestamp", "time", "date", "datetime", "dt"]
        for col in timestamp_cols:
            if col in df_raw.columns:
                log_timestamp = str(df_raw.iloc[0][col])
                break
        
        if not log_timestamp:
            log_timestamp = datetime.datetime.now().isoformat()

        # Determine threat status
        threat_status = "Normal Traffic" if attack.lower() == "normal" else "Threat Detected"

        elapsed_time = (time.time() - start_time) * 1000.0 # in ms
        logger.info(
            f"Prediction completed in {elapsed_time:.2f}ms. "
            f"Result: {attack} ({confidence}%), Severity: {severity}"
        )

        return PredictionResponse(
            attack=attack,
            confidence=confidence,
            severity=severity,
            timestamp=log_timestamp,
            status=threat_status
        )

    except ValueError as e:
        logger.error(f"Validation error during CSV prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Internal server error during prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during prediction: {str(e)}"
        )
