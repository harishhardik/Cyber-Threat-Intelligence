import logging
import sys
import uuid
from contextvars import ContextVar
from typing import Optional

# Context variable to store request ID across async tasks/threads
request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)

class RequestIdFilter(logging.Filter):
    """
    logging filter that injects request_id into the log record from ContextVar.
    """
    def filter(self, record):
        record.request_id = request_id_var.get() or "N/A"
        return True

def setup_logger(name: str = "sentinel_ai") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers if already configured
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [ReqID: %(request_id)s] [%(name)s] [%(filename)s:%(lineno)d]: %(message)s"
        )
        handler.setFormatter(formatter)
        handler.addFilter(RequestIdFilter())
        logger.addHandler(handler)
        
    return logger

# Primary logger for the application
logger = setup_logger()

def set_request_id(req_id: Optional[str] = None) -> str:
    """Sets the request ID in context, creating a new one if not provided."""
    if not req_id:
        req_id = str(uuid.uuid4())
    request_id_var.set(req_id)
    return req_id

def get_request_id() -> str:
    """Gets the current request ID from context or generates one."""
    req_id = request_id_var.get()
    if not req_id:
        req_id = set_request_id()
    return req_id
