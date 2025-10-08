import { useState } from 'react';
// We are using the most aggressive path fix here, assuming Recovery.tsx is deep (src/pages/Recovery.tsx) 
// and needs to go up two levels to find 'components' sibling of 'pages'.
import { Button } from '../components/ui/button'; 
// These imports assume the files are direct siblings of the 'pages' folder (src/types.ts, src/api/...)
import { AgentResponse } from '../types'; 
import { getRecoveryPlan } from '../api/recoveryService';

const Recovery = () => {
    // --- 1. INITIALIZE STATE VARIABLES ---
    const [userFeeling, setUserFeeling] = useState<string>('');
    const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // --- 2. SUBMISSION HANDLER ---
    const handleSubmit = async () => {
        if (isLoading || !userFeeling.trim()) return;

        setIsLoading(true);
        setAgentResponse(null); // Clear previous results
        setError(null);

        try {
            const requestData = { user_feeling: userFeeling };
            // 3. Use the real API service
            const data = await getRecoveryPlan(requestData); 
            
            console.log("API Response Received (Day 2 Goal):", data); 
            
            setAgentResponse(data);
        } catch (err) {
            console.error("Agent analysis failed:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
        } finally {
            setIsLoading(false);
            setUserFeeling(''); // Clear the input field after submission
        }
    };

    // --- 3. JSX RENDERING ---
    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-900 font-inter">
            <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-4 mt-12">
                💔 AI Breakup Recovery Team
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8 max-w-2xl text-center">
                Describe your current emotions and situation below. The four specialized AI agents will generate a comprehensive recovery plan for you.
            </p>

            {/* --- Input Form Area --- */}
            <div className="w-full max-w-3xl bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-2xl border border-red-200 dark:border-red-700">
                <textarea
                    className="w-full p-4 border border-gray-300 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-700 
                                 focus:ring-red-500 focus:border-red-500 transition duration-150 resize-none"
                    rows={6}
                    placeholder="Tell us how you're feeling, or what you're struggling with today (e.g., 'I miss them badly and feel like texting them.')"
                    value={userFeeling}
                    onChange={(e) => setUserFeeling(e.target.value)}
                    disabled={isLoading}
                />
                
                <Button 
                    onClick={handleSubmit}
                    disabled={isLoading || !userFeeling.trim()}
                    variant="default" 
                    className={`mt-4 w-full px-4 py-3 font-semibold rounded-xl transition duration-300 shadow-lg ${
                        isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                    }`}
                >
                    {isLoading ? 'Processing Agents... Please Wait' : 'Get Recovery Plan (Run Agents)'}
                </Button>
            </div>
            
            {/* --- Error Display Area --- */}
            {error && (
                <div className="w-full max-w-3xl mt-6 p-4 bg-yellow-100 border border-yellow-500 text-yellow-800 rounded-lg shadow-md">
                    <p className="font-semibold">Connection Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* --- Response Display Area (Day 2 Goal: Show Therapist Only) --- */}
            {agentResponse && (
                <div className="w-full max-w-3xl mt-10 space-y-6">
                    <div className="p-6 bg-red-100 dark:bg-red-900/50 rounded-xl shadow-xl border-l-4 border-red-600">
                        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-3">
                            🫂 Therapist Agent (Empathy & Coping)
                        </h2>
                        <p className="text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">
                            {agentResponse.therapist_agent}
                        </p>
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        (The other 3 agent responses will appear here after Day 4 integration)
                    </p>
                </div>
            )}
        </div>
    );
};

export default Recovery;