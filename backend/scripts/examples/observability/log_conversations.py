import uuid
import opik

# Generate unique thread ID per user session
user_id = "user_12345"
session_start_time = "2024-01-15T10:30:00Z"
thread_id = f"{user_id}-{session_start_time}"

@opik.track
def process_user_message(message, user_id:int):
    return "Response to "+ str(user_id)+' is:'+ message

process_user_message("What is Opik ?",1, opik_args={"trace": {"thread_id": thread_id}})