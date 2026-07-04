import os
import joblib
import pandas as pd
from typing import Tuple, List
from backend.utils.logger import logger

class MLService:
    def __init__(self, models_dir: str = None):
        if not models_dir:
            # Locate models directory relative to this file
            current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            models_dir = os.path.join(current_dir, "models")
            
        logger.info(f"Loading machine learning models from: {models_dir}")
        
        try:
            self.model = joblib.load(os.path.join(models_dir, "cyber_threat_model.pkl"))
            self.feature_encoder = joblib.load(os.path.join(models_dir, "feature_encoder.pkl"))
            self.target_encoder = joblib.load(os.path.join(models_dir, "target_encoder.pkl"))
            self.feature_names = joblib.load(os.path.join(models_dir, "feature_names.pkl"))
            logger.info("Successfully loaded model and encoders.")
        except Exception as e:
            logger.error(f"Error loading machine learning models: {str(e)}")
            raise RuntimeError(f"Could not load machine learning assets: {str(e)}")

    def get_feature_names(self) -> List[str]:
        return self.feature_names

    def get_feature_encoder(self):
        return self.feature_encoder

    def get_target_encoder(self):
        return self.target_encoder

    def get_severity(self, confidence: float) -> str:
        """
        Determines severity based on the confidence score:
        - Confidence > 90 -> Critical
        - 80-90 -> High
        - 60-80 -> Medium
        - Below 60 -> Low
        """
        if confidence > 90.0:
            return "Critical"
        elif 80.0 <= confidence <= 90.0:
            return "High"
        elif 60.0 <= confidence < 80.0:
            return "Medium"
        else:
            return "Low"

    def predict_first_row(self, df_processed: pd.DataFrame) -> Tuple[str, float, str]:
        """
        Runs prediction on the first row of a preprocessed DataFrame.
        
        Args:
            df_processed: Preprocessed pandas DataFrame matching training features.
            
        Returns:
            Tuple[str, float, str]: (attack_category, confidence_percentage, severity)
        """
        try:
            # We only predict for the first row as per the incident logging requirements
            first_row = df_processed.iloc[[0]]
            
            # Predict the class index
            class_idx_arr = self.model.predict(first_row)
            class_idx = int(class_idx_arr[0])
            
            # Predict the probability distribution
            prob_arr = self.model.predict_proba(first_row)
            confidence = float(prob_arr[0][class_idx]) * 100.0
            confidence = round(confidence, 2)
            
            # Decode class index back to attack category string
            attack_category = self.target_encoder.inverse_transform([class_idx])[0]
            
            # Assign severity based on confidence
            severity = self.get_severity(confidence)
            
            logger.info(
                f"Prediction successful: Attack={attack_category}, "
                f"Confidence={confidence}%, Severity={severity}"
            )
            return attack_category, confidence, severity
            
        except Exception as e:
            logger.error(f"Prediction failed in MLService: {str(e)}")
            raise RuntimeError(f"ML Prediction failure: {str(e)}")

_ml_service = None

def get_ml_service() -> MLService:
    global _ml_service
    if _ml_service is None:
        _ml_service = MLService()
    return _ml_service
