export interface AgentResponse {
    therapist_agent: string;
    closure_agent: string;
    routine_planner_agent: string;
    brutal_honesty_agent: string;
    final_summary?: string; 
    timestamp?: string;
}

export interface AnalysisRequest {
    user_feeling: string;
    // image_base64?: string; 
}