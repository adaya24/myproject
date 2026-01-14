import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from backend.main import app
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Breakup Recovery AI Agent...")
    print("📡 API available at: http://127.0.0.1:8000")
    print("📚 Documentation at: http://127.0.0.1:8000/docs")
    print("⚡ Press Ctrl+C to stop\n")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=True
    )