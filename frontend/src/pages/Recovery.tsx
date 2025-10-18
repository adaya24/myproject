import { useState } from 'react';
import { Button } from '../components/ui/button';
import { RecoveryPlan, UserInput, AgentResponse } from '../types';
import { getRecoveryPlan } from '../api/recoveryService';
import AgentCard from '../components/AgentCard';
import { cn } from '../lib/utils';

const Recovery = () => {
    const [userFeeling, setUserFeeling] = useState('');
    const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (isLoading || !userFeeling.trim()) return;
        
        setIsLoading(true);
        setError('');
        try {
            const userInput: UserInput = { 
                feelings_description: userFeeling 
            };
            const plan = await getRecoveryPlan(userInput);
            setRecoveryPlan(plan);
        } catch (err) {
            setError('Failed to fetch recovery plan. Please try again.');
            console.error('Error fetching recovery plan:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Enhanced Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                        <span className="text-3xl">💔</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        AI Breakup Recovery Team
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Describe your current emotions and situation below. The four specialized AI agents will generate a comprehensive recovery plan for you.
                    </p>
                </div>

                {/* Enhanced Input Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 max-w-4xl mx-auto border border-red-100">
                    <div className="space-y-6">
                        <textarea
                            className="w-full p-6 border-2 border-gray-200 rounded-xl text-gray-800 bg-white/50 
                                     focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 
                                     resize-none text-lg placeholder-gray-400 shadow-inner"
                            rows={6}
                            placeholder="Tell us how you're feeling, or what you're struggling with today (e.g., 'I miss them badly and feel like texting them.')"
                            value={userFeeling}
                            onChange={(e) => setUserFeeling(e.target.value)}
                            disabled={isLoading}
                        />
                        
                        <div className="flex justify-center">
                            <Button 
                                onClick={handleSubmit}
                                disabled={isLoading || !userFeeling.trim()}
                                className={cn(
                                    "px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl",
                                    "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
                                    "transform hover:scale-105 active:scale-95",
                                    isLoading && "bg-gray-500 cursor-not-allowed hover:scale-100"
                                )}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing Agents... Please Wait
                                    </span>
                                ) : (
                                    'Get Recovery Plan (Run Agents)'
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-xl shadow-md">
                            <p className="font-semibold">Connection Error:</p>
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Enhanced Results Section */}
                {recoveryPlan && (
                    <div className="space-y-8">
                        {/* Summary Section with Better Styling */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-xl">👑</span>
                                </div>
                                <h2 className="text-2xl font-bold">Team Leader Summary</h2>
                            </div>
                            <p className="text-lg leading-relaxed text-white/90">
                                {recoveryPlan.summary}
                            </p>
                        </div>

                        {/* Agent Cards Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Your AI Recovery Team
                            </h2>
                            <p className="text-gray-600 mt-2">Four specialized agents working together for your recovery</p>
                        </div>
                        
                        {/* Enhanced Agent Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recoveryPlan.agents.map((agent: AgentResponse, index: number) => (
                                <div 
                                    key={index}
                                    className={cn(
                                        "transform transition-all duration-500 hover:scale-105 hover:rotate-1",
                                        "animate-fade-in-up"
                                    )}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <AgentCard
                                        agent_name={agent.agent_name}
                                        role={agent.role}
                                        advice={agent.advice}
                                        className={cn(
                                            "h-full shadow-2xl border-0",
                                            index === 0 && "bg-gradient-to-br from-blue-50 to-blue-100",
                                            index === 1 && "bg-gradient-to-br from-green-50 to-green-100", 
                                            index === 2 && "bg-gradient-to-br from-purple-50 to-purple-100",
                                            index === 3 && "bg-gradient-to-br from-orange-50 to-orange-100"
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Enhanced Empty State */}
                {!recoveryPlan && !isLoading && (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <span className="text-5xl">💭</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">
                            Ready to help you feel better
                        </h3>
                        <p className="text-gray-500 text-lg max-w-md mx-auto">
                            Share your feelings above to get started with your personalized recovery plan from our AI team
                        </p>
                    </div>
                )}
            </div>

            {/* Add some custom animations */}
          
        </div>
    );
};

export default Recovery;