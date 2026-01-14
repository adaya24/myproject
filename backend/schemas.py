from pydantic import BaseModel
from typing import List

class AgentResponse(BaseModel):
    agent_name: str
    role: str
    advice: str

class UserInput(BaseModel):
    feelings_description: str

class RecoveryPlan(BaseModel):
    summary: str
    agents: List[AgentResponse]