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

const AgentCard: React.FC<AgentCardProps> = ({ 
  agent_name, 
  role, 
  advice, 
  className 
}) => {
  const icon = agentIcons[agent_name] || "👤";

  return (
    <Card className={cn(
      "w-full transition-all duration-300 hover:shadow-2xl border-2 border-white/50",
      "backdrop-blur-sm bg-white/70",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{icon}</div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">
              {agent_name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 font-medium mt-1">
              {role}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/50 rounded-lg p-4 border border-gray-200/50">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {advice}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentCard