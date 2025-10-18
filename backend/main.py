from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Correct relative imports for project structure
from .schemas import RecoveryPlan, UserInput
from .agents import run_multi_agent_stub 


app = FastAPI(title="AGENTS_CLOSURE_MISMATCH")
origins = [
    "http://localhost:5173",    # React dev server
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def health_check():
    """Basic health check to confirm API is running."""
    return {"status": "ok", "message": "API is running."}


@app.post("/run_agents", response_model=RecoveryPlan, tags=["Agents"])
def run_agents(user_input: UserInput):
    """
    Endpoint that receives user input and returns the coordinated recovery plan
    from the multi-agent system.
    """
    # The orchestration logic is delegated to the function in agents.py
    return run_multi_agent_stub(user_input)