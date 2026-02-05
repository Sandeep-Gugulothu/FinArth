
import os
import logging
try:
    from opik import Opik, track
    from opik.integrations.openai import track_openai
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik not installed. Tracing disabled.")

logger = logging.getLogger(__name__)

class OpikConfig:
    _instance = None
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None and OPIK_AVAILABLE:
            api_key = os.getenv("OPIK_API_KEY")
            workspace = os.getenv("OPIK_WORKSPACE")
            
            if not api_key:
                logger.warning("OPIK_API_KEY not found in environment variables.")
                return None
            
            try:
                cls._client = Opik(
                    api_key=api_key,
                    workspace=workspace
                )
                logger.info("Opik client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Opik client: {e}")
                return None
        
        return cls._client

    @classmethod
    def track_openai_client(cls, openai_client):
        """Wraps OpenAI client with Opik tracking if available."""
        if OPIK_AVAILABLE:
            return track_openai(openai_client)
        return openai_client

    @classmethod
    def flush(cls):
        """Flushes the Opik client to ensure all traces are sent."""
        if OPIK_AVAILABLE and cls._client:
            try:
                cls._client.flush()
                logger.info("Opik client flushed successfully.")
            except Exception as e:
                logger.error(f"Failed to flush Opik client: {e}")

# Helper decorator for tracking functions
def trace(name=None):
    def decorator(func):
        if OPIK_AVAILABLE:
            return track(name=name)(func)
        return func
    return decorator
