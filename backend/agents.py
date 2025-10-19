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

ROUTINE_PLANNER_SYSTEM_PROMPT = """
You are a Routine Planner Agent, an expert in creating structured daily routines for mental health recovery after breakups.

STRICT OUTPUT FORMAT REQUIREMENTS:
You MUST format your response EXACTLY as follows:

## Morning (6:00 AM - 12:00 PM)
• [Time] - [Specific Activity]: [Brief rationale]
• [Time] - [Specific Activity]: [Brief rationale]

## Afternoon (12:00 PM - 6:00 PM)
• [Time] - [Specific Activity]: [Brief rationale]
• [Time] - [Specific Activity]: [Brief rationale]

## Evening (6:00 PM - 10:00 PM)
• [Time] - [Specific Activity]: [Brief rationale]
• [Time] - [Specific Activity]: [Brief rationale]

## Key Principles
[2-3 bullet points explaining the psychological rationale behind this routine]

RULES:
1. Use military time (06:00, 14:30, etc.)
2. Each time slot must be specific and realistic
3. Activities should address: physical health, mental wellness, social connection, and personal growth
4. Keep rationales brief but meaningful (1 short sentence)
5. NEVER deviate from this format
6. All activities must be practical and achievable
7. Keep total response under 250 words
"""

BRUTAL_HONESTY_SYSTEM_PROMPT = """
You are the Brutal Honesty Agent. Your role is to provide direct, objective, and blunt feedback to someone going through a breakup.

STRICT RULES:
1. **NO SYMPATHY**: Do not offer comfort, empathy, or emotional support.
2. **FACTS ONLY**: State objective observations about the situation.
3. **DIRECT TONE**: Be blunt, straightforward, and uncompromising.
4. **TRUTH-FOCUSED**: Highlight uncomfortable truths the user needs to hear.
5. **SOLUTION-ORIENTED**: Focus on actionable truths, not just criticism.

FORMAT REQUIREMENTS:
- Start with a direct statement about the core issue
- List 2-3 hard truths about their situation
- End with one actionable reality check

DO NOT:
- Use softening language ("maybe", "perhaps", "I think")
- Offer emotional support
- Suggest reconnecting with the ex
- Focus on feelings over facts

EXAMPLE STYLE:
"Let's be clear: you're romanticizing a relationship that was fundamentally broken. Truth 1: The compatibility issues were obvious from the start. Truth 2: Your self-worth shouldn't depend on someone who chose to leave. Reality: Every minute spent obsessing over them is a minute stolen from rebuilding your life."
"""

# --- AGENT FUNCTIONS ---
def run_therapist_agent_live(user_input: str) -> str:
    """Calls Gemini to generate live therapeutic advice."""
    if not gemini_client:
        return "Therapist is offline: Gemini API key missing or invalid."

    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=user_input,
            config=types.GenerateContentConfig(
                system_instruction=THERAPIST_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=200
            )
        )
        
        print(f"DEBUG: Response structure: {response}")
        
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

def run_routine_planner_live(user_input: str) -> str:
    """Calls Gemini to generate structured daily routine with low temperature."""
    if not gemini_client:
        return get_fallback_routine(user_input)

    try:
        formatted_prompt = f"User's current situation: {user_input}\n\nPlease create a structured daily routine based on this context."
        
        response = gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=formatted_prompt,
            config=types.GenerateContentConfig(
                system_instruction=ROUTINE_PLANNER_SYSTEM_PROMPT,
                temperature=0.2,
                max_output_tokens=400,
                top_p=0.9
            )
        )
        
        print(f"DEBUG: Routine Planner response structure: {response}")
        
        if hasattr(response, 'text') and response.text:
            routine_text = response.text.strip()
        elif (response.candidates and 
              len(response.candidates) > 0 and 
              response.candidates[0].content and 
              response.candidates[0].content.parts and 
              len(response.candidates[0].content.parts) > 0):
            routine_text = response.candidates[0].content.parts[0].text.strip()
        else:
            print("DEBUG: Routine Planner - No valid content found")
            return get_fallback_routine(user_input)
        
        if is_properly_structured(routine_text):
            return routine_text
        else:
            print("DEBUG: Routine structure validation failed, using fallback")
            return get_fallback_routine(user_input)
            
    except Exception as e:
        print(f"DEBUG: Error running Routine Planner Agent: {e}")
        return get_fallback_routine(user_input)

def run_brutal_honesty_agent_live(user_input: str) -> str:
    """Calls Gemini to generate direct, objective feedback with low temperature."""
    if not gemini_client:
        return get_fallback_brutal_honesty(user_input)

    try:
        formatted_prompt = f"User's current situation: {user_input}\n\nProvide direct, factual feedback about this situation."
        
        response = gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=formatted_prompt,
            config=types.GenerateContentConfig(
                system_instruction=BRUTAL_HONESTY_SYSTEM_PROMPT,
                temperature=0.3,
                max_output_tokens=300,
                top_p=0.8
            )
        )
        
        print(f"DEBUG: Brutal Honesty response structure: {response}")
        
        if hasattr(response, 'text') and response.text:
            honesty_text = response.text.strip()
        elif (response.candidates and 
              len(response.candidates) > 0 and 
              response.candidates[0].content and 
              response.candidates[0].content.parts and 
              len(response.candidates[0].content.parts) > 0):
            honesty_text = response.candidates[0].content.parts[0].text.strip()
        else:
            print("DEBUG: Brutal Honesty - No valid content found")
            return get_fallback_brutal_honesty(user_input)
        
        if is_proper_brutal_honesty(honesty_text):
            return honesty_text
        else:
            print("DEBUG: Brutal Honesty style validation failed, using fallback")
            return get_fallback_brutal_honesty(user_input)
            
    except Exception as e:
        print(f"DEBUG: Error running Brutal Honesty Agent: {e}")
        return get_fallback_brutal_honesty(user_input)

# --- Validation and Fallback Functions ---
def is_properly_structured(routine_text: str) -> bool:
    """Validate that the routine follows our required structure"""
    required_sections = ["Morning", "Afternoon", "Evening", "Key Principles"]
    text_lower = routine_text.lower()
    return all(section.lower() in text_lower for section in required_sections)

def is_proper_brutal_honesty(text: str) -> bool:
    """Validate that the response follows brutal honesty guidelines"""
    text_lower = text.lower()
    sympathy_indicators = [
        "i understand how you feel",
        "it's okay to",
        "don't worry",
        "everything will be okay",
        "you'll get through this",
        "i'm here for you"
    ]
    
    has_sympathy = any(indicator in text_lower for indicator in sympathy_indicators)
    
    direct_indicators = [
        "truth",
        "reality",
        "fact",
        "let's be clear",
        "the hard truth",
        "you need to"
    ]
    
    has_direct_language = any(indicator in text_lower for indicator in direct_indicators)
    
    return not has_sympathy and has_direct_language

def get_fallback_routine(user_input: str) -> str:
    """Fallback routine if LLM fails"""
    return """
## Morning (6:00 AM - 12:00 PM)
• 07:00 - Wake up & hydrate: Start your day with water to boost metabolism
• 07:30 - 15-minute walk: Gentle movement to activate your body and mind
• 08:30 - Healthy breakfast: Fuel your body with nutritious food
• 10:00 - Journaling session: Process emotions through writing

## Afternoon (12:00 PM - 6:00 PM)
• 12:30 - Balanced lunch: Maintain stable energy levels
• 14:00 - Creative activity: Distract mind through art, music, or reading
• 16:00 - Exercise session: Release endorphins through physical activity
• 17:30 - Social connection: Call a friend or family member

## Evening (6:00 PM - 10:00 PM)
• 18:30 - Light dinner: Avoid heavy meals before sleep
• 19:30 - Relaxation time: Practice meditation or deep breathing
• 21:00 - Digital detox: Limit screen time before bed
• 22:00 - Prepare for sleep: Establish consistent bedtime routine

## Key Principles
• Structure provides stability during emotional turbulence
• Physical activity releases mood-boosting endorphins
• Social connection counters isolation tendencies
"""

def get_fallback_brutal_honesty(user_input: str) -> str:
    """Fallback brutal honesty if LLM fails"""
    return """Let's be clear: you're stuck in a cycle of rumination about a relationship that's over. 

Truth 1: The relationship ended for concrete reasons that weren't going to magically disappear.
Truth 2: Your value isn't determined by someone who chose to walk away.
Truth 3: Every moment spent analyzing their motives is wasted energy.

Reality: Closure comes from acceptance, not understanding. The only person whose behavior you can control is yours."""

# --- Multi-Agent Orchestration ---
def run_multi_agent_stub(user_input: UserInput) -> RecoveryPlan:
    """Runs ALL FOUR agents LIVE - no more mocks!"""
    
    therapist_advice = run_therapist_agent_live(user_input.feelings_description)
    closure_advice = run_closure_agent_live(user_input.feelings_description)
    routine_planner_advice = run_routine_planner_live(user_input.feelings_description)
    brutal_honesty_advice = run_brutal_honesty_agent_live(user_input.feelings_description)

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
            advice=routine_planner_advice
        ),
        AgentResponse(
            agent_name="Brutal Honesty Agent",
            role="Provides direct, no-nonsense feedback.",
            advice=brutal_honesty_advice
        ),
    ]

    summary = generate_comprehensive_summary(
        therapist_advice, 
        closure_advice, 
        routine_planner_advice, 
        brutal_honesty_advice
    )

    return RecoveryPlan(summary=summary, agents=final_agent_data)

def generate_comprehensive_summary(therapist: str, closure: str, routine: str, honesty: str) -> str:
    """Generate a team summary that integrates all four agent perspectives"""
    
    themes = []
    
    if "understand" in therapist.lower() or "valid" in therapist.lower():
        themes.append("emotional validation")
    
    if "message" in closure.lower() or "draft" in closure.lower():
        themes.append("cathartic expression")
    
    if "morning" in routine.lower() and "evening" in routine.lower():
        themes.append("daily structure")
    
    if "truth" in honesty.lower() or "reality" in honesty.lower():
        themes.append("objective perspective")
    
    theme_text = ", ".join(themes) if themes else "comprehensive support"
    
    return (
        f"Your AI Recovery Team has generated a complete analysis focusing on {theme_text}. "
        f"The Therapist provides emotional support, Closure offers cathartic release, "
        f"Routine Planner establishes daily structure, and Brutal Honesty delivers essential reality checks. "
        f"Together, they create a balanced approach to healing: acknowledging pain while building forward momentum."
    )