# main.py content

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import dotenv to load environment variables like the GEMINI_API_KEY
from dotenv import load_dotenv

# 1. CREATE THE APP INSTANCE
# Uvicorn looks for this 'app' variable!
app = FastAPI()

# 2. ADD CORS MIDDLEWARE (Crucial for connecting to the React frontend)
# The React frontend will run on a different port (e.g., 5173), so you must allow it.
origins = [
    "http://localhost:5173",  # Replace with your actual frontend port if different
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. DEFINE A SIMPLE ROOT/HEALTH CHECK ROUTE
# This allows you to test that the server is working.
@app.get("/")
def read_root():
    return {"status": "Backend is running!", "project": "Breakup Recovery Agent"}

# Load environment variables (from .env file)
load_dotenv() 

# You can now run the server again: uvicorn main:app --reload