from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Breakup Recovery AI Agent", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {
        "message": "Breakup Recovery AI Agent API",
        "endpoints": {
            "GET /": "This info page",
            "POST /run_agents": "Run all 4 AI agents with user input",
            "GET /docs": "Interactive API documentation"
        },
        "agents": [
            "Therapist Agent - Emotional support",
            "Closure Agent - Cathartic writing",
            "Routine Planner - Daily structure",
            "Brutal Honesty - Objective insights"
        ]
    }

@app.post("/run_agents")
def run_agents(user_input: dict):
    """
    Run all four AI agents with the user's feelings description.
    
    Example request:
    ```json
    {
        "feelings_description": "I just broke up and feel completely lost"
    }
    ```
    """
    # Import here to avoid circular imports
    from .agents import run_multi_agent_stub
    from .schemas import UserInput
    
    # Convert dict to UserInput
    user_input_obj = UserInput(**user_input)
    return run_multi_agent_stub(user_input_obj)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "breakup-recovery-agent"}