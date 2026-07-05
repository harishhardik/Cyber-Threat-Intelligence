import os
import json
import google.generativeai as genai
from typing import List, Tuple, Optional
from backend.utils.logger import logger
from backend.schemas.prediction_schema import GeminiAnalysisResponse, ChatMessage

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.is_mock = False
        self.available_models = []
        
        # Check if the API key is valid or placeholder
        if not self.api_key or self.api_key in ("YOUR_GEMINI_API_KEY", "", "None"):
            logger.warning("GEMINI_API_KEY is not configured or is using the placeholder. GeminiService will run in SIMULATED MOCK MODE.")
            self.is_mock = True
        else:
            try:
                genai.configure(api_key=self.api_key)
                
                # Dynamically discover available models to avoid 404s
                try:
                    self.available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
                except Exception as list_err:
                    logger.warning(f"Could not list available Gemini models: {str(list_err)}")
                    self.available_models = [f"Error: {str(list_err)}"]
                
                # Check for standard models in priority order
                priority_list = [
                    "models/gemini-1.5-flash",
                    "models/gemini-2.0-flash",
                    "models/gemini-1.5-pro",
                    "models/gemini-2.0-flash-exp",
                ]
                
                selected_model = None
                for model_path in priority_list:
                    if any(model_path in am or am in model_path for am in self.available_models if isinstance(am, str) and not am.startswith("Error")):
                        selected_model = model_path
                        break
                
                # If priority model is not available but we have some model, pick the first generation model
                if not selected_model and self.available_models and not any(isinstance(m, str) and m.startswith("Error") for m in self.available_models):
                    selected_model = self.available_models[0]
                
                # Fallback default if all else fails
                if not selected_model:
                    selected_model = "models/gemini-1.5-flash"
                
                self.model_name = selected_model.replace("models/", "")
                self.model = genai.GenerativeModel(self.model_name)
                logger.info(f"Gemini service initialized successfully using model: {self.model_name} (Detected available: {self.available_models})")
            except Exception as e:
                logger.error(f"Failed to initialize Google Gemini API: {str(e)}. Falling back to MOCK MODE.")
                self.is_mock = True

    def analyze_threat(
        self, 
        attack: str, 
        confidence: float, 
        severity: str, 
        timestamp: str
    ) -> GeminiAnalysisResponse:
        """
        Uses Gemini to generate detailed threat analysis: explanation, business impact,
        risk assessment, mitigation steps, and an executive summary.
        """
        if self.is_mock:
            return self._generate_mock_analysis(attack, confidence, severity)

        prompt = f"""
        You are an expert Security Operations Center (SOC) Analyst and Threat Intelligence AI.
        Analyze the following cyber threat prediction:
        - Attack Category: {attack}
        - Prediction Confidence: {confidence}%
        - Determined Severity: {severity}
        - Detection Timestamp: {timestamp}

        Provide a structured, enterprise-grade analysis containing:
        1. Threat Explanation: Technical explanation of this attack category and what it represents.
        2. Business Impact: Strategic and financial impact if this threat is successfully executed.
        3. Risk Assessment: Assessment of risk level (based on severity and confidence) and likelihood.
        4. Mitigation Steps: Immediate actionable technical mitigation steps for the security team.
        5. Executive Summary: High-level overview of the incident suitable for C-level executives.
        """

        try:
            # We request structured output matching GeminiAnalysisResponse Pydantic schema
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiAnalysisResponse,
                    temperature=0.2,
                )
            )
            
            # Parse the returned JSON directly into Pydantic model
            data = json.loads(response.text)
            return GeminiAnalysisResponse(**data)
            
        except Exception as e:
            logger.error(f"Gemini API analysis failed: {str(e)}. Falling back to mock data.")
            return self._generate_mock_analysis(attack, confidence, severity)

    def chat(self, question: str, history: List[ChatMessage]) -> Tuple[str, List[ChatMessage]]:
        """
        Maintains conversation history and generates the next turn in the chat.
        """
        # Format new history including the user's question
        updated_history = list(history)
        updated_history.append(ChatMessage(role="user", content=question))

        if self.is_mock:
            response_text = self._generate_mock_chat_reply(question, attack_context=None)
            updated_history.append(ChatMessage(role="model", content=response_text))
            return response_text, updated_history

        try:
            # Format history for Gemini SDK
            gemini_history = []
            for msg in history:
                gemini_history.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": [msg.content]
                })

            # Start chat session
            chat_session = self.model.start_chat(history=gemini_history)
            
            # Send message and get response
            response = chat_session.send_message(question)
            response_text = response.text
            
            updated_history.append(ChatMessage(role="model", content=response_text))
            return response_text, updated_history
            
        except Exception as e:
            logger.error(f"Gemini Chat API failed: {str(e)}")
            fallback_text = f"[Gemini API Error: {str(e)}]\n\nI encountered an issue connecting to the Gemini service, but I'm here to help. Regarding your query: '{question}', please check your API key configuration."
            updated_history.append(ChatMessage(role="model", content=fallback_text))
            return fallback_text, updated_history

    def _generate_mock_analysis(self, attack: str, confidence: float, severity: str) -> GeminiAnalysisResponse:
        """Generates highly realistic mock analyses for demonstration/testing."""
        logger.info(f"Generating simulated threat analysis for: {attack}")
        
        explanations = {
            "Reconnaissance": "Reconnaissance involves active or passive scanning to discover entry points, network topology, and open ports. In this case, the model flagged suspicious probing patterns resembling host discovery or port sweeps.",
            "DoS": "Denial of Service (DoS) attacks attempt to exhaust resource limits, causing services to slow down or crash. The system detected high packet frequencies and connection volumes designed to overload system capacity.",
            "Exploits": "Exploits target known software vulnerabilities (e.g., buffer overflows or injection flaws) to hijack processing flows. The traffic signatures match malicious exploit payloads targeting enterprise applications.",
            "Fuzzers": "Fuzzing represents feeding random or structured invalid data to inputs to discover software crashes or memory leaks. The log shows repeated inputs of malformed payloads or headers targeting API endpoints.",
            "Generic": "Generic threat signatures correspond to general anomalies in network logs that do not fit a specific taxonomy but diverge significantly from normal baseline profiles.",
            "Normal": "The traffic behaves within regular bounds, showing standard handshake patterns and payload sizes with no malicious threat profiles observed.",
            "Backdoor": "Backdoor threats represent unauthorized remote access channels established via trojans or reverse shells, letting attackers bypass security controls. The patterns indicate connection attempts to unauthorized external IPs.",
            "Shellcode": "Shellcode involves injecting executable binary instructions into memory to launch command shells. The system flagged hex-encoded command injections or shellcode signatures in incoming network packets.",
            "Worms": "Worms are self-replicating malware targeting network shares or services to spread. The model detected automated replication behavior targeting multiple internal hosts consecutively.",
            "Analysis": "Analysis attacks indicate scanning or active tampering attempts targeting web applications, trying to extract configuration details or database structures."
        }
        
        explanation = explanations.get(attack, f"Detected malicious traffic pattern categorized as {attack}. The network sequence exhibits features highly correlated with security incidents.")
        
        from backend.schemas.prediction_schema import MitigationDetails
        
        return GeminiAnalysisResponse(
            threat_explanation=explanation,
            business_impact=f"If left unchecked, this {attack} activity could lead to unauthorized system access, compromise sensitive operations data, or degrade services. It may violate compliance standards (e.g., SOC2, ISO 27001) and impact client trust.",
            technical_analysis=f"Network traffic packet sequence matching {attack} category signatures. State indicators confirm anomalous headers and data lengths.",
            risk_assessment=f"Risk Level: {severity}. The machine learning model identified this pattern with {confidence}% confidence. Immediate investigation is advised as the signature represents active staging or execution of an exploit.",
            mitigation=MitigationDetails(
                immediate_actions=f"1. Isolate the affected IP/subnet from critical resources.\n2. Enable strict firewall rate-limiting and verify intrusion prevention system (IPS) rules.\n3. Conduct a credential audit and verify system patch status for exposed services.\n4. Analyze related server logs for secondary indicators of compromise.",
                long_term_recommendations=f"1. Enforce strict parameter verification protocols.\n2. Implement a unified Web Application Firewall (WAF) to inspect payload parameters.\n3. Implement continuous logging and anomaly detection at trust boundaries."
            ),
            executive_summary=f"SentinelAI detected a {severity}-severity {attack} threat with a confidence level of {confidence}%. Recommended response is isolation and verification of active network controls to block further lateral movement."
        )

    def _generate_mock_chat_reply(self, question: str, attack_context: Optional[str]) -> str:
        """Generates realistic responses to security chat questions in mock mode."""
        q_lower = question.lower()
        if "mitigate" in q_lower or "fix" in q_lower or "prevent" in q_lower:
            return "To mitigate network threats like this, you should:\n1. Update network access control lists (ACLs) to block the source IP.\n2. Ensure all external services are fully patched and run behind a WAF.\n3. Implement network segmentation to isolate public-facing assets from internal databases."
        elif "explain" in q_lower or "what is" in q_lower:
            return "This threat pattern represents anomalous actions where anomalous payloads (such as malformed headers or port scanning sweeps) are sent to system ports to probe vulnerabilities or consume bandwidth resources."
        else:
            return f"[Simulated Response - Gemini Key Not Loaded]\n\nThank you for asking: '{question}'.\nTo run the live Google Gemini API, please configure a valid `GEMINI_API_KEY` in the `backend/.env` file."

_gemini_service = None

def get_gemini_service() -> GeminiService:
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
