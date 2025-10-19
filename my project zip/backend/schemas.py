from pydantic import BaseModel, Field
from typing import List, Optional

# --- Input Schema (What the Frontend Sends) ---
class UserInput(BaseModel):
    """
    Defines the structured input data received from the React frontend.
    The 'image_base64' field is used for chat screenshot analysis.
    """
    feelings_description: str = Field(..., description="User's text input describing their current feelings.")
    image_base64: Optional[str] = Field(None, description="Optional base64 encoded chat screenshot for analysis.")

# --- Output Schemas (What the Backend Returns) ---

class AgentResponse(BaseModel):
    """
    A single response block from one specialized AI agent.
    """
    agent_name: str = Field(..., description="The name of the agent (e.g., 'Therapist Agent').")
    role: str = Field(..., description="The agent's brief role description.")
    advice: str = Field(..., description="The core recovery advice or message from the agent.")

class RecoveryPlan(BaseModel):
    """
    The main response schema containing coordinated outputs from the multi-agent team.
    """
    summary: str = Field(..., description="A synthesized summary from the 'Team Leader' agent.")
    agents: List[AgentResponse] = Field(..., description="List of individual responses from the four agents.")

# The frontend (Person B) MUST agree to expect this RecoveryPlan structure.
