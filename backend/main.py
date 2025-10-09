from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# FIX: Changed from 'from .schemas import...' to 'from schemas import...' 
# and 'from agents import...' to resolve the Python ImportError
from .schemas import RecoveryPlan, UserInput, AgentResponse
from .agents import run_multi_agent_stub


app = FastAPI()
origins = [
    "http://localhost:5173",    # React dev server
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow all HTTP methods
    allow_headers=["*"],        # Allow all headers
)

# Mock data simulating a successful run of the four AI agents


@app.post("/run_agents", response_model=RecoveryPlan)
def run_agents(user_input: UserInput):
    """
    Endpoint that returns a mock recovery plan using the stub function.
    """
    # NOTE: The implementation must eventually call the real agent orchestration logic
    return run_multi_agent_stub(user_input)