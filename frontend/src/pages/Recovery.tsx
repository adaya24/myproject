// src/pages/Recovery.tsx
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { RecoveryPlan, UserInput, AgentResponse } from '../types';
import { getRecoveryPlan } from '../api/recoveryService';
import AgentCard from '../components/AgentCard';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const Recovery = () => {
    const [userFeeling, setUserFeeling] = useState(() => {
        return localStorage.getItem('userFeeling') || '';
    });
    const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userFeeling) {
            navigate('/input');
        }
    }, [userFeeling, navigate]);

    const handleSubmit = async () => {
        if (isLoading || !userFeeling.trim()) return;
        
        setIsLoading(true);
        setError('');
        setRecoveryPlan(null);
        
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

    const handleStartOver = () => {
        localStorage.removeItem('userFeeling');
        navigate('/input');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 py-8 px-4 font-inter">
            <div className="max-w-7xl mx-auto">
                {/* Header with navigation */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
                    >
                        <span className="text-xl">←</span>
                        <span>Back to Home</span>
                    </button>
                    <button
                        onClick={handleStartOver}
                        className="px-4 py-2 text-sm bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all duration-200"
                    >
                        Start Over
                    </button>
                </div>

                {/* Enhanced Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                        <span className="text-3xl">💔</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4 px-4 break-words">
                        AI Breakup Recovery Team
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 break-words">
                        Based on your input, our four specialized AI agents are ready to create your recovery plan.
                    </p>
                </div>

                {/* User Input Preview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-12 max-w-4xl mx-auto border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                            <span className="text-lg">📝</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Your Input</h3>
                    </div>
                    <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                        <p className="text-gray-700 break-words whitespace-pre-wrap">
                            {userFeeling || "No input provided"}
                        </p>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => navigate('/input')}
                            className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center gap-1"
                        >
                            <span>Edit your input</span>
                            <span>✏️</span>
                        </button>
                    </div>
                </div>

                {/* Enhanced Input Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 mb-12 max-w-4xl mx-auto border border-red-100">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Ready to Generate Your Recovery Plan?
                            </h3>
                            <p className="text-gray-600">
                                Click the button below to activate all four AI agents
                            </p>
                        </div>
                        
                        <div className="flex justify-center">
                            <Button 
                                onClick={handleSubmit}
                                disabled={isLoading || !userFeeling.trim()}
                                className={cn(
                                    "px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl",
                                    "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
                                    "transform hover:scale-105 active:scale-95",
                                    "text-white border-0 w-full sm:w-auto",
                                    (isLoading || !userFeeling.trim()) && "opacity-70 cursor-not-allowed hover:scale-100"
                                )}
                            >
                                {isLoading ? 'Processing Agents...' : 'Generate Recovery Plan (Run All Agents)'}
                            </Button>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-xl shadow-md">
                            <p className="font-semibold break-words">Connection Error:</p>
                            <p className="break-words">{error}</p>
                        </div>
                    )}
                </div>

                {/* Central Loading Spinner */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-spin"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-transparent border-t-red-500 rounded-full animate-spin" 
                                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="text-2xl">💔</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2 break-words">
                                AI Agents are analyzing your situation
                            </h3>
                            <p className="text-gray-500 max-w-md break-words">
                                Our four specialized agents are working together to create your personalized recovery plan...
                            </p>
                            <div className="mt-4 flex justify-center space-x-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {!isLoading && recoveryPlan && (
                    <div className="space-y-8 px-2 animate-fade-in-up">
                        {/* Summary Section */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 lg:p-8 shadow-2xl max-w-6xl mx-auto">
                            <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg lg:text-xl">👑</span>
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold break-words">Team Leader Summary</h2>
                            </div>
                            <div className="mt-4 bg-white/10 rounded-xl p-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                                <p className="text-base lg:text-lg leading-relaxed break-words whitespace-pre-wrap">
                                    {recoveryPlan.summary}
                                </p>
                            </div>
                        </div>

                        {/* Agent Cards Section */}
                        <div className="text-center mb-6 lg:mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent break-words">
                                Your AI Recovery Team
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm lg:text-base break-words">
                                Four specialized agents working together for your recovery
                            </p>
                        </div>
                        
                        {/* Enhanced Agent Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
                            {recoveryPlan.agents.map((agent: AgentResponse, index: number) => (
                                <div 
                                    key={index}
                                    className={cn(
                                        "transform transition-all duration-500 hover:scale-105",
                                        "animate-fade-in-up h-full"
                                    )}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <AgentCard
                                        agent_name={agent.agent_name}
                                        role={agent.role}
                                        advice={agent.advice}
                                        className={cn(
                                            "h-full shadow-xl border-0",
                                            index === 0 && "bg-gradient-to-br from-blue-50 to-blue-100",
                                            index === 1 && "bg-gradient-to-br from-green-50 to-green-100", 
                                            index === 2 && "bg-gradient-to-br from-purple-50 to-purple-100",
                                            index === 3 && "bg-gradient-to-br from-orange-50 to-orange-100"
                                        )}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Final Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Button
                                onClick={handleStartOver}
                                variant="outline"
                                className="px-8 py-4 text-lg font-bold rounded-2xl border-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                            >
                                Start New Analysis
                            </Button>
                            <Button
                                onClick={() => window.print()}
                                className="px-8 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            >
                                Save This Plan
                            </Button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !recoveryPlan && (
                    <div className="text-center py-12 lg:py-16">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-2xl">
                            <span className="text-4xl lg:text-5xl">💭</span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-700 mb-3 lg:mb-4 break-words">
                            Ready to Generate Your Recovery Plan
                        </h3>
                        <p className="text-gray-500 text-base lg:text-lg max-w-md mx-auto px-4 break-words">
                            Click the button above to activate our AI agents and create your personalized recovery plan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recovery;