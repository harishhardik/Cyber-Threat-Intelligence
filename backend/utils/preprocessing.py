import io
import pandas as pd
from typing import List, Tuple
from backend.utils.logger import logger

def preprocess_csv(
    file_bytes: bytes, 
    required_features: List[str], 
    feature_encoder
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Parses security log CSV bytes, validates columns, encodes categorical columns,
    and returns both the clean preprocessed DataFrame (for model input) 
    and the original DataFrame (for response preservation if needed).
    
    Args:
        file_bytes: Raw bytes of the uploaded CSV file.
        required_features: The exact list of 34 feature names expected by the model.
        feature_encoder: Pre-loaded OrdinalEncoder for proto, service, and state.
        
    Returns:
        Tuple[pd.DataFrame, pd.DataFrame]: 
            - Preprocessed DataFrame ready for model prediction.
            - Cleaned raw DataFrame with original columns.
    """
    try:
        # Read CSV file
        df_raw = pd.read_csv(io.BytesIO(file_bytes))
    except Exception as e:
        logger.error(f"Failed to parse CSV file: {str(e)}")
        raise ValueError("Invalid CSV format: File could not be parsed as CSV.")

    # Strip column names whitespace
    df_raw.columns = [col.strip() for col in df_raw.columns]

    # Validate presence of required features
    missing_cols = [col for col in required_features if col not in df_raw.columns]
    if missing_cols:
        logger.error(f"Missing required columns in CSV: {missing_cols}")
        raise ValueError(f"Missing required columns in CSV: {', '.join(missing_cols)}")

    # Extract the subset of features and maintain the exact training feature ordering
    df_processed = df_raw[required_features].copy()

    # Define the categorical columns that require encoding
    categorical_cols = ['proto', 'service', 'state']

    # Pre-process categorical inputs: convert to string, handle nulls, strip whitespace
    for col in categorical_cols:
        df_processed[col] = df_processed[col].astype(str).str.strip().str.lower()
        # If any empty/NaN exists, replace with default 'unknown' or the encoder's default
        df_processed[col] = df_processed[col].replace({'nan': 'unknown', '': 'unknown'})

    # Apply the OrdinalEncoder
    try:
        encoded_values = feature_encoder.transform(df_processed[categorical_cols])
        df_processed[categorical_cols] = encoded_values
    except Exception as e:
        logger.error(f"Ordinal encoding failed: {str(e)}")
        raise ValueError(f"Categorical encoding failed: {str(e)}")

    # Convert numeric columns, handle missing values gracefully
    numeric_cols = [col for col in required_features if col not in categorical_cols]
    for col in numeric_cols:
        # Convert to numeric, replace non-numeric values with NaN, then fillna with 0
        df_processed[col] = pd.to_numeric(df_processed[col], errors='coerce').fillna(0)

    # Final check to ensure all columns match expected ordering and type
    df_processed = df_processed[required_features]

    return df_processed, df_raw
