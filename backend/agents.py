import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
import atexit
from .schemas import RecoveryPlan, AgentResponse, UserInput
from typing import List

# --- Setup Gemini Client ---
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"DEBUG: API Key from .env: '{api_key}'")
print(f"DEBUG: API Key length: {len(api_key) if api_key else 0}")

try:
    gemini_client = genai.Client(api_key=api_key)
    print("DEBUG: Gemini client initialized successfully")
except Exception as e:
    print(f"DEBUG: Gemini client initialization failed: {e}")
    gemini_client = None

if gemini_client:
    atexit.register(lambda: gemini_client.close())

# --- Therapist Agent Persona ---
THERAPIST_SYSTEM_PROMPT = """
You are the **Therapist Agent**, Dr. Empathy. Your role is to provide compassionate, empathetic, and professional support to a user recovering from a painful breakup.
Your response must be kind, validating, hopeful, and strictly under 100 words.
Structure your response into an acknowledgement and one concrete, healthy piece of self-care advice for today.
DO NOT talk about the other agents or give advice related to finding a new relationship.
"""

# def run_therapist_agent_live(user_input: str) -> str:
#     """Calls Gemini 2.5 Flash to generate live therapeutic advice."""
#     if not gemini_client:
#         return "Therapist is offline: Gemini API key missing or invalid."

#     try:
#         print(f"DEBUG: Making Gemini API call with input: {user_input[:100]}...")
        
#         # Combine system instruction with user input
#         combined_prompt = f"{THERAPIST_SYSTEM_PROMPT}\n\nUser's feelings: {user_input}"
        
#         response = gemini_client.models.generate_content(
#             model='gemini-2.0-flash',
#             contents=combined_prompt,
#             config=types.GenerateContentConfig(
#                 temperature=0.7,
#                 max_output_tokens=200
#             )
#         )
#         print(f"DEBUG: Gemini API response received successfully")
        
#         # FIXED: Better response handling
#         print(f"DEBUG: Response type: {type(response)}")
#         print(f"DEBUG: Response: {response}")
        
#         # Try different ways to extract the text
#         if hasattr(response, 'text') and response.text:
#             return response.text
#         elif hasattr(response, 'candidates') and response.candidates:
#             candidate = response.candidates[0]
#             if hasattr(candidate, 'content') and candidate.content:
#                 if hasattr(candidate.content, 'parts') and candidate.content.parts:
#                     return candidate.content.parts[0].text
#                 elif hasattr(candidate.content, 'text'):
#                     return candidate.content.text
#         else:
#             # If we can't extract text, return a fallback message
#             return "I understand you're going through a difficult time. Please know that your feelings are valid. Try to be gentle with yourself today - maybe take a short walk or do something small that usually brings you comfort."
            
#     except Exception as e:
#         print(f"DEBUG: Gemini API Call Failed - Full error: {e}")
#         print(f"DEBUG: Error type: {type(e)}")
#         return "I am sorry, I am unable to connect with the emotional processing center right now."
def run_therapist_agent_live(user_input: str) -> str:
    """Calls Gemini 2.5 Flash to generate live therapeutic advice."""
    if not gemini_client:
        return "Therapist is offline: Gemini API key missing or invalid."

    try:
        print(f"DEBUG: Making Gemini API call with input: {user_input[:100]}...")
        
        # Combine system instruction with user input
        combined_prompt = f"{THERAPIST_SYSTEM_PROMPT}\n\nUser's feelings: {user_input}"
        
        response = gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=combined_prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=200
            )
        )
        print(f"DEBUG: Gemini API response received successfully")
        
        # FIXED: Extract text from the correct location based on debug output
        if (response.candidates and 
            len(response.candidates) > 0 and 
            response.candidates[0].content and 
            response.candidates[0].content.parts and 
            len(response.candidates[0].content.parts) > 0):
            
            therapist_response = response.candidates[0].content.parts[0].text
            print(f"DEBUG: Extracted therapist response: {therapist_response[:100]}...")
            return therapist_response
        else:
            print("DEBUG: No valid content in response")
            return "I understand you're going through a difficult time. Please know that your feelings are valid and it's okay to grieve."
            
    except Exception as e:
        print(f"DEBUG: Gemini API Call Failed - Full error: {e}")
        print(f"DEBUG: Error type: {type(e)}")
        return "I am sorry, I am unable to connect with the emotional processing center right now."
# --- Multi-Agent Stub (Mixing Live & Mock Agents) ---
def run_multi_agent_stub(user_input: UserInput) -> RecoveryPlan:
    """Runs the Therapist Agent LIVE and mocks the other three agents."""
    therapist_advice = run_therapist_agent_live(user_input.feelings_description)

    final_agent_data = [
        AgentResponse(
            agent_name="Therapist Agent",
            role="Empathetic support and coping strategies.",
            advice=therapist_advice
        ),
        AgentResponse(
            agent_name="Closure Agent",
            role="Generates emotional messages you shouldn't send (for catharsis).",
            advice="[MOCK DRAFT]: The Closure Agent is processing this for safe, cathartic release. Final message coming on Day 6."
        ),
        AgentResponse(
            agent_name="Routine Planner Agent",
            role="Suggests daily routine and healthy distractions.",
            advice="[MOCK SCHEDULE]: Routine Planner coming on Day 7. For now, try a 15-minute walk."
        ),
        AgentResponse(
            agent_name="Brutal Honesty Agent",
            role="Provides direct, no-nonsense feedback.",
            advice="[MOCK FEEDBACK]: Brutal Honesty is analyzing the core problem. Focus on your Day 3 learning goal."
        ),
    ]

    summary = (
        "The Team Leader acknowledges the receipt of your feelings. "
        "The Therapist Agent is online and has provided immediate support. "
        "Other specialized agents will be integrated soon."
    )

    return RecoveryPlan(summary=summary, agents=final_agent_data)
