
import os
import logging
import uuid
from typing import List, Dict, Any, Optional

try:
    from opik import opik_context, Opik, track
    from opik.integrations.openai import track_openai
    from opik.integrations.langchain import OpikTracer
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik not installed. Tracing disabled.")
from ai_agent.session_cache import session_cache

logger = logging.getLogger(__name__)

class OpikConfig:
    _instance = None
    _client = None
    _thread_id:any

    @classmethod
    def get_client(cls):
        if cls._client is None and OPIK_AVAILABLE:
            api_key = os.getenv("OPIK_API_KEY")
            workspace = os.getenv("OPIK_WORKSPACE")
            # The Opik constructor expects 'host' for custom URLs
            host = os.getenv("OPIK_URL_OVERRIDE")
            project_name = os.getenv("OPIK_PROJECT_NAME", "FINARTH")

            if not api_key:
                logger.warning("OPIK_API_KEY not found in environment variables.")
                return None

            try:
                # Initialize with correct argument names
                cls._client = Opik(
                    api_key=api_key,
                    workspace=workspace,
                    host=host if host and host.strip() else None,
                    project_name=project_name
                )
                cls._client.auth_check()
                logger.info(f"Opik client initialized for project: {project_name}")
            except Exception as e:
                logger.error(f"Failed to initialize Opik client: {e}")
                return None

        return cls._client

    @classmethod
    def track_openai_client(cls, openai_client):
        """Wraps OpenAI client with Opik tracking if available."""
        if OPIK_AVAILABLE:
            cls.get_client()
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

    @classmethod
    def get_current_trace_id(cls):
        """Returns the current trace ID if available."""
        if OPIK_AVAILABLE:
            try:
                trace_data = opik_context.get_current_trace_data()
                if trace_data:
                    # Using .id as per documentation and common patterns
                    return trace_data.id
            except Exception as e:
                logger.debug(f"Could not get current trace ID: {e}")
        return None

    @classmethod
    def log_feedback(cls, trace_id: str, name: str, value: float):
        """Logs a feedback score to Opik for a given trace ID."""
        if OPIK_AVAILABLE:
            client = cls.get_client()
            if client:
                try:
                    project_name = os.getenv("OPIK_PROJECT_NAME", "FINARTH")
                    # Using the exact structure from the provided documentation
                    client.log_traces_feedback_scores(
                        scores=[{
                            "id": trace_id,
                            "name": name,
                            "value": value,
                            "project_name": project_name
                        }]
                    )
                    # Flushed immediately to ensure visibility in dashboard
                    client.flush()
                    logger.info(f"Logged feedback '{name}={value}' to Opik project '{project_name}' for trace: {trace_id}")
                except Exception as e:
                    logger.error(f"Failed to log feedback to Opik: {e}")

    @classmethod
    def get_thread_id(cls, user_id):
        """Retrieves the current thread ID for tracing."""
        try:
            if OPIK_AVAILABLE and cls._client:
                if cls._thread_id:
                    return cls._thread_id
                else:
                    session_id = session_cache.get(user_id)
                    cls._thread_id= f"{session_id}_trace_{user_id}"
                    return cls._thread_id
            else:
                cls._thread_id = user_id
                return cls._thread_id
        except:
            logger.warning("Either Opik not available or error in forming threadId, returning user_id as thread_id")
            cls._thread_id = user_id
            return cls._thread_id

# Helper decorator for tracking functions
def trace(name=None):
    def decorator(func):
        if OPIK_AVAILABLE:
            return track(name=name)(func)
        return func
    return decorator

# Helper decorator to obtain opik context
def context_opik(name=None):
    def decorator(func):
        if OPIK_AVAILABLE:
            return opik_context(name=name)(func)
        return func
    return decorator