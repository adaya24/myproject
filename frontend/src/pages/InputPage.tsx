// src/pages/InputPage.tsx
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const InputPage = () => {
  const [userFeeling, setUserFeeling] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem('userFeeling', userFeeling);
    navigate('/recovery');
  };

  const examplePrompts = [
    "I miss my ex and keep checking their social media",
    "I feel lonely and don't know how to move on",
    "We broke up recently and I'm struggling with anger",
    "I'm having trouble focusing on my daily life",
    "I want to text them but know I shouldn't"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 font-inter">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-60 h-60 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-8 transition-colors"
        >
          <span className="text-xl">←</span>
          <span>Back to Home</span>
        </button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">💭</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Share Your Feelings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              This is your safe space. Be honest about what you're experiencing.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/50 mb-8">
            <div className="space-y-6">
              {/* Guidance Text */}
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How to share:</h3>
                <ul className="text-gray-600 space-y-1 list-disc pl-5">
                  <li>Describe your current emotions</li>
                  <li>Mention specific challenges you're facing</li>
                  <li>Share what you'd like to work on</li>
                  <li>Be as detailed or brief as you like</li>
                </ul>
              </div>

              {/* Textarea */}
              <textarea
                className="w-full p-6 border-2 border-gray-200 rounded-2xl text-gray-800 bg-white/50 
                         focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 
                         resize-none text-lg placeholder-gray-400 shadow-inner min-h-[200px] lg:min-h-[250px]
                         focus:outline-none focus:shadow-lg"
                rows={8}
                placeholder="Start typing here... For example: 'I've been feeling really lonely since the breakup. I keep replaying our last conversation in my head and wondering what I could have done differently. It's hard to focus at work and I'm not sleeping well.'"
                value={userFeeling}
                onChange={(e) => setUserFeeling(e.target.value)}
              />
              
              {/* Character Count */}
              <div className="text-right">
                <span className={cn(
                  "text-sm",
                  userFeeling.length > 500 ? "text-rose-600" : "text-gray-500"
                )}>
                  {userFeeling.length} / 2000 characters
                </span>
              </div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Need inspiration? Try one of these:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setUserFeeling(prompt)}
                  className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200 text-gray-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all duration-200 shadow-sm hover:shadow"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!userFeeling.trim()}
              className={cn(
                "px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl",
                "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700",
                "transform hover:scale-105 active:scale-95",
                "text-white border-0 w-full sm:w-auto",
                !userFeeling.trim() && "opacity-70 cursor-not-allowed hover:scale-100"
              )}
            >
              Continue to AI Analysis →
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setUserFeeling('')}
              className="px-12 py-6 text-lg font-bold rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="mt-10 p-4 bg-rose-50/50 rounded-xl border border-rose-100 max-w-2xl mx-auto">
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-rose-700">Your privacy is protected:</span> 
              {" "}Your input is processed anonymously and is not stored permanently. This is a judgment-free zone.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InputPage;