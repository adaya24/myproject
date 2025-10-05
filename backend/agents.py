from .schemas import RecoveryPlan, AgentResponse, UserInput
from typing import Dict, Any

# Mock data simulating a successful run of the four AI agents
MOCK_AGENT_DATA = [
    AgentResponse(
        agent_name="Therapist Agent",
        role="Empathetic support and coping strategies.",
        advice="Your feelings are valid. Focus on deep breathing and writing down three things you are grateful for today."
    ),
    AgentResponse(
        agent_name="Closure Agent",
        role="Generates emotional messages you shouldn't send (for catharsis).",
        advice="[UNSENT MESSAGE DRAFT]: 'I miss our mornings and can't believe this is over. I hate that you just walked away. I hope you think of me.'"
    ),
    AgentResponse(
        agent_name="Routine Planner Agent",
        role="Suggests daily routine and healthy distractions.",
        advice="Schedule: 7:00 AM - Walk/Run (30 min). 1:00 PM - Learn FastAPI documentation (1 hour). 7:00 PM - Call a friend."
    ),
    AgentResponse(
        agent_name="Brutal Honesty Agent",
        role="Provides direct, no-nonsense feedback.",
        advice="The relationship was unsustainable because you avoided difficult conversations. You need to focus on self-improvement, not reconciliation. Move on."
    ),
]

def run_multi_agent_stub(user_input: UserInput) -> RecoveryPlan:
    """
    (Day 1 Stub) Simulates the full multi-agent workflow by returning mock data.

    Args:
        user_input: The Pydantic model containing the user's feelings and image.

    Returns:
        A RecoveryPlan object filled with mock responses.
    """
    # NOTE: We can inspect the user input here, but we return fixed mock data for the stub.
    print(f"Received user input: {user_input.feelings_description[:50]}...")
    
    summary = "The team has analyzed your input. We recognize your distress but strongly advise focusing on self-discipline and forward momentum. Review the coordinated plan below."
    
    return RecoveryPlan(
        summary=summary,
        agents=MOCK_AGENT_DATA
    )

# On Day 2, this function will be replaced by actual Gemini API calls.
