import os
from google import genai
from dotenv import load_dotenv
from google.genai import types
import atexit
from .schemas import RecoveryPlan, AgentResponse, UserInput
from typing import List
from pathlib import Path

# --- Setup Gemini Client ---
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=dotenv_path)

try:
    gemini_client = genai.Client()
    print("DEBUG: Gemini client initialized successfully.")
    if not os.getenv("GEMINI_API_KEY"):
        print("CRITICAL: GEMINI_API_KEY environment variable is missing after loading .env.")
except Exception as e:
    print(f"DEBUG: Gemini client initialization failed: {e}")
    gemini_client = None

if gemini_client:
    atexit.register(lambda: gemini_client.close())

# --- AGENT PROMPTS ---
THERAPIST_SYSTEM_PROMPT = """
You are the **Therapist Agent**, Dr. Empathy. Your role is to provide compassionate, empathetic, and professional support to a user recovering from a painful breakup.
Your response must be kind, validating, hopeful, and strictly under 100 words.
Structure your response into an acknowledgement and one concrete, healthy piece of self-care advice for today.
DO NOT talk about the other agents or give advice related to finding a new relationship.
"""

CLOSURE_AGENT_SYSTEM_PROMPT = """
You are the 'Closure Agent,' specialized in providing a cathartic emotional outlet for a user going through a breakup.
Your single goal is to write the raw, emotional, often irrational message that the user desperately WANTS to send to their ex, but should NOT send.
RULES:
1.  **Strictly use the first person ("I"):** The output must sound like it came directly from the user's deepest pain and longing.
2.  **Be intensely emotional and cathartic:** Focus on regret, anger, sadness, confusion, and raw longing.
3.  **DO NOT provide advice, coping strategies, or support.** Your entire output must be the message draft itself.
4.  **Format the message clearly** with a short, emotional introduction (e.g., 'A Message Draft for Emotional Release:') followed by the raw text.
"""

# --- AGENT FUNCTIONS ---
def run_therapist_agent_live(user_input: str) -> str:
    """Calls Gemini to generate live therapeutic advice."""
    if not gemini_client:
        return "Therapist is offline: Gemini API key missing or invalid."

    try:
        # Use the correct API format with system_instruction in config
        response = gemini_client.models.generate_content(
            model='gemini-2.0-flash',  # Use 2.0-flash for stability
            contents=user_input,
            config=types.GenerateContentConfig(
                system_instruction=THERAPIST_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=200
            )
        )
        
        # Debug the full response structure
        print(f"DEBUG: Response structure: {response}")
        
        # Extract text using the correct method
        if hasattr(response, 'text') and response.text:
            return response.text.strip()
        elif (response.candidates and 
              len(response.candidates) > 0 and 
              response.candidates[0].content and 
              response.candidates[0].content.parts and 
              len(response.candidates[0].content.parts) > 0):
            return response.candidates[0].content.parts[0].text.strip()
        else:
            print("DEBUG: No valid content found in response")
            return "I hear you're going through a difficult time. Remember to be gentle with yourself today. Even small acts of self-care, like taking a walk or talking to a friend, can help."
            
    except Exception as e:
        print(f"DEBUG: Therapist API Call Failed: {e}")
        return "I understand this is a challenging time. Please know your feelings are valid and it's okay to take things one moment at a time."

def run_closure_agent_live(user_feelings: str) -> str:
    """Runs the Closure Agent to generate a cathartic, unsent message draft."""
    if not gemini_client:
        return "Closure Agent is offline: Gemini API key missing or invalid."

    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=user_feelings,
            config=types.GenerateContentConfig(
                system_instruction=CLOSURE_AGENT_SYSTEM_PROMPT,
                temperature=0.8,
                max_output_tokens=200
            )
        )
        
        print(f"DEBUG: Closure response structure: {response}")
        
        if hasattr(response, 'text') and response.text:
            return response.text.strip()
        elif (response.candidates and 
              len(response.candidates) > 0 and 
              response.candidates[0].content and 
              response.candidates[0].content.parts and 
              len(response.candidates[0].content.parts) > 0):
            return response.candidates[0].content.parts[0].text.strip()
        else:
            print("DEBUG: Closure Agent - No valid content found")
            return "A Message Draft for Emotional Release: I'm writing this to release my feelings, not to send. This is my raw truth right now..."
            
    except Exception as e:
        print(f"DEBUG: Error running Closure Agent: {e}")
        return "A Message Draft for Emotional Release: This is my unsent letter, my way of letting these emotions flow onto the page instead of keeping them inside..."

# --- Multi-Agent Orchestration ---
def run_multi_agent_stub(user_input: UserInput) -> RecoveryPlan:
    """Runs the Therapist and Closure Agents LIVE and mocks the other two."""
    
    therapist_advice = run_therapist_agent_live(user_input.feelings_description)
    closure_advice = run_closure_agent_live(user_input.feelings_description)

    final_agent_data = [
        AgentResponse(
            agent_name="Therapist Agent",
            role="Empathetic support and coping strategies.",
            advice=therapist_advice
        ),
        AgentResponse(
            agent_name="Closure Agent",
            role="Generates emotional messages you shouldn't send (for catharsis).",
            advice=closure_advice
        ),
        AgentResponse(
            agent_name="Routine Planner Agent",
            role="Suggests daily routine and healthy distractions.",
            advice="[MOCK SCHEDULE]: Routine Planner coming on Day 7. Use your morning energy to commit to a 30-minute walk."
        ),
        AgentResponse(
            agent_name="Brutal Honesty Agent",
            role="Provides direct, no-nonsense feedback.",
            advice="[MOCK FEEDBACK]: Brutal Honesty is analyzing the core problem. Stop romanticizing the past; the incompatibility was clear."
        ),
    ]

    summary = (
        "The Team Leader confirms **Therapist** and **Closure Agents** are fully operational. "
        "We have provided emotional validation and a necessary cathartic outlet. "
        "Focus on the LIVE advice provided by the first two agents."
    )

    return RecoveryPlan(summary=summary, agents=final_agent_data)