import axios from 'axios';
import { AgentResponse, AnalysisRequest } from '../types';

// IMPORTANT: This should target the port Person A is running FastAPI on
const API_URL = 'http://localhost:8000'; 

export async function getRecoveryPlan(requestData: AnalysisRequest): Promise<AgentResponse> {
  try {
    // Correcting the endpoint path to match Person A's main.py file
    const response = await axios.post(`${API_URL}/run_agents`, {
        // FIX: Mapping the frontend key (user_feeling) to the backend's expected key (feelings_description)
        feelings_description: requestData.user_feeling,
        // The backend UserInput schema might also expect an optional image_base64 key, 
        // which we omit now as the API uses default values.
    });
    
    // --- Data Mapping to flatten the complex backend response ---
    const agents = response.data.agents;
    const summary = response.data.summary;
    
    // This finds the correct agent advice by name, as the backend returns an array.
    const findAdvice = (name: string) => 
        agents.find((a: any) => a.agent_name === name)?.advice || `Error: ${name} data missing.`;

    const mappedResponse: AgentResponse = {
        therapist_agent: findAdvice("Therapist Agent"),
        closure_agent: findAdvice("Closure Agent"),
        routine_planner_agent: findAdvice("Routine Planner Agent"),
        brutal_honesty_agent: findAdvice("Brutal Honesty Agent"),
        final_summary: summary,
        timestamp: new Date().toISOString()
    }
    
    return mappedResponse; 

  } catch (error) {
    console.error("API Call Failed:", error);
    // This message will appear in the yellow box if the connection fails
    throw new Error("Connection Failed. Ensure Person A's FastAPI server is running on port 8000 and CORS is configured.");
  }
}