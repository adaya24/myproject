import { RecoveryPlan, UserInput } from '../types';

// Mock data for testing
const mockRecoveryPlan: RecoveryPlan = {
  summary: "Your recovery plan focuses on emotional processing, establishing routine, and honest self-reflection.",
  agents: [
    {
      agent_name: "Therapist Agent",
      role: "Mental Health Therapist",
      advice: "I understand you're feeling sad. It's completely normal to experience these emotions. Let's work through this together with some breathing exercises and positive affirmations."
    },
    {
      agent_name: "Closure Agent",
      role: "Closure Specialist", 
      advice: "To help find closure, I suggest writing a letter expressing your feelings (without sending it). This can help process emotions and move forward."
    },
    {
      agent_name: "Routine Planner Agent",
      role: "Daily Routine Expert",
      advice: "Let's establish a gentle routine: morning walk, healthy breakfast, and 10 minutes of journaling. Small consistent steps build momentum."
    },
    {
      agent_name: "Brutal Honesty Agent",
      role: "Direct Truth Teller",
      advice: "Look, feeling sad won't last forever. The world keeps spinning whether you're sad or not. Get up, do one productive thing, and the rest will follow."
    }
  ]
};

export const getRecoveryPlan = async (userInput: UserInput): Promise<RecoveryPlan> => {
  try {
    const response = await fetch('http://localhost:8000/run_agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInput),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RecoveryPlan = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed, using mock data:', error);
    // Return mock data if API fails
    return mockRecoveryPlan;
  }
};