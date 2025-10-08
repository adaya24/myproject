import axios from 'axios';
import { AgentResponse, AnalysisRequest } from '../types';

// IMPORTANT: This should target the port Person A is running FastAPI on
const API_URL = 'http://localhost:8000'; 
// NOTE: Person A's endpoint is /run_agents, not /api/analyze/

export async function getRecoveryPlan(requestData: AnalysisRequest): Promise<AgentResponse> {
  try {
    // Correcting the endpoint path to match Person A's main.py file
    const response = await axios.post(`${API_URL}/run_agents`, requestData);
    
    // The structure returned by Person A's stub needs to be mapped to AgentResponse fields.
    // Person A's stub returns a list of agents inside a RecoveryPlan object.
    const agents = response.data.agents;
    
    // Simple mapping: We assume the agents are returned in a specific order (Therapist is first, etc.)
    // However, Person A's stub returns an array of objects that need processing.
    // Since the frontend structure is flat (AgentResponse), we map the names manually for now.
    
    const therapistData = agents.find((a: any) => a.agent_name === "Therapist Agent");
    const closureData = agents.find((a: any) => a.agent_name === "Closure Agent");
    const routineData = agents.find((a: any) => a.agent_name === "Routine Planner Agent");
    const brutalData = agents.find((a: any) => a.agent_name === "Brutal Honesty Agent");

    const mappedResponse: AgentResponse = {
        therapist_agent: therapistData ? therapistData.advice : 'Error: Therapist agent data missing.',
        closure_agent: closureData ? closureData.advice : 'Error: Closure agent data missing.',
        routine_planner_agent: routineData ? routineData.advice : 'Error: Routine planner data missing.',
        brutal_honesty_agent: brutalData ? brutalData.advice : 'Error: Brutal honesty agent data missing.',
        final_summary: response.data.summary,
        timestamp: new Date().toISOString()
    }
    
    return mappedResponse; 

  } catch (error) {
    console.error("API Call Failed:", error);
    // This message will appear in the yellow box if the connection fails
    throw new Error("Connection Failed. Ensure Person A's FastAPI server is running on port 8000 and CORS is configured.");
  }
}