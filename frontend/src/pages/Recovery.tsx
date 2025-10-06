import React from 'react';
import { Button } from '@/components/ui/button'; 

const Recovery = () => {
  return (
    // Tailwind classes for a professional, centered layout
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-900 text-center">
      <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-4">
        AI Breakup Recovery Agent
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8 max-w-md">
        Frontend Setup Complete! Ready for Day 2 logic.
      </p>
      {/* Testing the Shadcn Button component */}
      <Button 
        variant="default" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform transform hover:scale-[1.02]"
      >
        Click to Simulate Agent Run
      </Button>
    </div>
  );
};

export default Recovery;
