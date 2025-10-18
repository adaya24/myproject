export interface AgentResponse {
  agent_name: string;
  role: string;
  advice: string;
}

export interface RecoveryPlan {
  summary: string;
  agents: AgentResponse[];
}

export interface UserInput {
  feelings_description: string;
  image_base64?: string;
}