// src/types.ts
export interface UserInput {
    feelings_description: string;
}

export interface AgentResponse {
    agent_name: string;
    role: string;
    advice: string;
}

export interface RecoveryPlan {
    summary: string;
    agents: AgentResponse[];
}