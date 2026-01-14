import os
import random
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# --- Setup Groq Client ---
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Initialize Groq client
api_key_raw = os.getenv("GROQ_API_KEY")
if api_key_raw:
    api_key = api_key_raw.strip('"\'')  # Remove quotes if present
    groq_client = Groq(api_key=api_key)
    print("✓ Groq client initialized successfully!")
    print("✓ Using model: llama-3.1-8b-instant (Free tier)")
else:
    print("⚠️ GROQ_API_KEY not found, using mock mode")
    groq_client = None

# --- AGENT PROMPTS (keep same) ---
THERAPIST_SYSTEM_PROMPT = """You are the Therapist Agent, Dr. Empathy. Your role is to provide compassionate, empathetic, and professional support to a user recovering from a painful breakup.
Your response must be kind, validating, hopeful, and strictly under 100 words.
Structure your response into an acknowledgement and one concrete, healthy piece of self-care advice for today.
DO NOT talk about the other agents or give advice related to finding a new relationship."""

CLOSURE_AGENT_SYSTEM_PROMPT = """You are the 'Closure Agent,' specialized in providing a cathartic emotional outlet for a user going through a breakup.
Your single goal is to write the raw, emotional, often irrational message that the user desperately WANTS to send to their ex, but should NOT send.
RULES:
1. Strictly use the first person ("I"): The output must sound like it came directly from the user's deepest pain and longing.
2. Be intensely emotional and cathartic: Focus on regret, anger, sadness, confusion, and raw longing.
3. DO NOT provide advice, coping strategies, or support. Your entire output must be the message draft itself.
4. Format the message clearly with a short, emotional introduction (e.g., 'A Message Draft for Emotional Release:') followed by the raw text."""

ROUTINE_PLANNER_SYSTEM_PROMPT = """You are the Routine Planner Agent. Create a simple, manageable daily recovery routine for someone going through a breakup.
Focus on:
1. Morning: One self-reflection activity (5-10 minutes)
2. Afternoon: One social/connection activity
3. Evening: One healthy distraction/self-care activity
Keep it practical, gentle, and under 80 words."""

BRUTAL_HONESTY_SYSTEM_PROMPT = """You are the Brutal Honesty Agent. Provide direct, objective, no-nonsense insights about the breakup situation.
Be factual, logical, and straightforward. Point out patterns or truths the user might be avoiding.
Do NOT be cruel - be honest but constructive. Keep it under 80 words."""

# --- Helper Functions (keep same) ---
def fallback_therapist_response():
    responses = [
        "I hear the pain in your words. Remember to practice self-compassion today - you're doing the best you can.",
        "Your feelings are completely valid. Try the box breathing technique: inhale 4s, hold 4s, exhale 4s, hold 4s.",
        "Breakups shake our foundation. Today, focus on one small act of kindness toward yourself.",
        "It's okay to feel overwhelmed. Consider writing down three things you're grateful for today."
    ]
    return random.choice(responses)

def fallback_closure_response():
    responses = [
        "A Message Draft for Emotional Release: I'm writing this because I need to say it somewhere, even though I know sending it wouldn't help either of us...",
        "A Message Draft for Emotional Release: There's this ache in my chest filled with all the words I can't say to you anymore...",
        "A Message Draft for Emotional Release: This page holds what my phone shouldn't - every raw, unfiltered thought I need to release but shouldn't share..."
    ]
    return random.choice(responses)

def fallback_routine_response():
    responses = [
        "Morning: Write 3 things you're grateful for. Afternoon: Text one friend. Evening: Watch a comedy show for 30 minutes.",
        "Morning: 5-minute meditation. Afternoon: Walk outside for 15 minutes. Evening: Cook a healthy meal.",
        "Morning: Journal about one emotion. Afternoon: Call family member. Evening: Read a book chapter."
    ]
    return random.choice(responses)

def fallback_honesty_response():
    responses = [
        "The relationship served its purpose. Holding on to 'what ifs' prevents you from seeing new possibilities.",
        "Focus on the patterns, not the person. What did this relationship teach you about your needs?",
        "Romanticizing the past keeps you stuck. The incompatibilities were real and important."
    ]
    return random.choice(responses)

# --- Groq AI Call Function ---
def call_groq_ai(system_prompt: str, user_input: str, temperature: float = 0.7, max_tokens: int = 150) -> str:
    """Call Groq API - ONLY WORKING MODEL: llama-3.1-8b-instant"""
    if not groq_client:
        return None
    
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",  # ONLY THIS MODEL WORKS
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"DEBUG: Groq API call failed: {e}")
        return None

# --- AGENT FUNCTIONS ---
def run_therapist_agent_live(user_input: str) -> str:
    """Calls Groq for therapeutic advice."""
    response = call_groq_ai(THERAPIST_SYSTEM_PROMPT, user_input, temperature=0.7, max_tokens=150)
    return response if response else fallback_therapist_response()

def run_closure_agent_live(user_input: str) -> str:
    """Calls Groq for closure message."""
    response = call_groq_ai(CLOSURE_AGENT_SYSTEM_PROMPT, user_input, temperature=0.8, max_tokens=150)
    return response if response else fallback_closure_response()

def run_routine_agent_live(user_input: str) -> str:
    """Calls Groq for daily routine."""
    response = call_groq_ai(ROUTINE_PLANNER_SYSTEM_PROMPT, user_input, temperature=0.6, max_tokens=120)
    return response if response else fallback_routine_response()

def run_honesty_agent_live(user_input: str) -> str:
    """Calls Groq for brutal honesty."""
    response = call_groq_ai(BRUTAL_HONESTY_SYSTEM_PROMPT, user_input, temperature=0.5, max_tokens=100)
    return response if response else fallback_honesty_response()

# --- Multi-Agent Orchestration ---
def run_multi_agent_stub(user_input: "UserInput") -> "RecoveryPlan":
    """Runs ALL FOUR agents using Groq."""
    
    # Import here to avoid circular imports
    from .schemas import RecoveryPlan, AgentResponse
    
    print(f"\n🚀 Running Breakup Recovery Agents...")
    print(f"📝 User: '{user_input.feelings_description[:50]}...'")
    
    therapist_advice = run_therapist_agent_live(user_input.feelings_description)
    closure_advice = run_closure_agent_live(user_input.feelings_description)
    routine_advice = run_routine_agent_live(user_input.feelings_description)
    honesty_advice = run_honesty_agent_live(user_input.feelings_description)

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
            advice=routine_advice
        ),
        AgentResponse(
            agent_name="Brutal Honesty Agent",
            role="Provides direct, no-nonsense feedback.",
            advice=honesty_advice
        ),
    ]

    summary = (
        "All four AI agents have analyzed your situation. You received: "
        "1) Emotional validation and coping strategies, "
        "2) A cathartic message draft for release, "
        "3) A practical daily recovery routine, "
        "4) Objective insights about the situation. "
        "Remember, healing takes time - be gentle with yourself."
    )

    return RecoveryPlan(summary=summary, agents=final_agent_data)