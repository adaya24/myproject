import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AgentCardProps {
  agent_name: string;
  role: string;
  advice: string;
  className?: string;
}

// Agent icons mapping
const agentIcons: { [key: string]: string } = {
  "Therapist Agent": "🧠",
  "Closure Agent": "✉️",
  "Routine Planner Agent": "📅",
  "Brutal Honesty Agent": "💥"
}

// Function to format text with proper line breaks and structure
const formatAdviceText = (text: string, agentName: string) => {
  if (!text) return text;

  // For Routine Planner, preserve the structured format
  if (agentName === "Routine Planner Agent") {
    return text.split('\n').map((line, index) => {
      // Handle section headers (## Header)
      if (line.startsWith('## ')) {
        return (
          <div key={index} className="mt-4 mb-2 first:mt-0">
            <h4 className="font-bold text-blue-700 text-sm uppercase tracking-wide">
              {line.replace('## ', '')}
            </h4>
          </div>
        );
      }
      // Handle bullet points (• item)
      else if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="flex items-start ml-2 mb-1">
            <span className="text-gray-500 mr-2 mt-0.5">•</span>
            <span className="text-gray-700 text-sm flex-1">{line.replace('•', '').trim()}</span>
          </div>
        );
      }
      // Handle regular lines
      else if (line.trim()) {
        return (
          <div key={index} className="mb-1">
            <span className="text-gray-700 text-sm">{line}</span>
          </div>
        );
      }
      // Handle empty lines
      return <br key={index} />;
    });
  }

  // For other agents, use simple line breaks
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

const AgentCard: React.FC<AgentCardProps> = ({ 
  agent_name, 
  role, 
  advice, 
  className 
}) => {
  const icon = agentIcons[agent_name] || "👤";

  return (
    <Card className={cn(
      "w-full transition-all duration-300 hover:shadow-xl border-2 border-white/50",
      "backdrop-blur-sm bg-white/70 flex flex-col min-h-[300px] max-h-[500px]",
      "hover:scale-105 hover:border-blue-200",
      className
    )}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-2xl flex-shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-bold text-gray-800 truncate">
              {agent_name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 font-medium mt-1 line-clamp-2">
              {role}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto py-2">
        <div className={cn(
          "bg-white/50 rounded-lg p-4 border border-gray-200/50 h-full",
          "text-gray-700 text-sm leading-relaxed",
          agent_name === "Routine Planner Agent" && "space-y-1"
        )}>
          {formatAdviceText(advice, agent_name)}
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentCard