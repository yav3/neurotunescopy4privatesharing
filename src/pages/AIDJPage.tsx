import React from 'react'
import { Radio, Play } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAudioStore } from '@/stores'
import { toast } from "@/hooks/use-toast"

const therapeuticGoals = [
  {
    id: 'focus',
    label: 'Deep Focus',
    description: 'Alpha waves for concentration and productivity',
    gradient: 'from-blue-500 to-cyan-500',
    backendKey: 'Focus Enhancement'
  },
  {
    id: 'relaxation',
    label: 'Relaxation',
    description: 'Theta waves for deep relaxation and stress relief',
    gradient: 'from-green-500 to-emerald-500',
    backendKey: 'Stress Reduction'
  },
  {
    id: 'sleep',
    label: 'Sleep',
    description: 'Delta waves for deep, restorative sleep',
    gradient: 'from-blue-600 to-indigo-600',
    backendKey: 'Sleep Preparation'
  },
  {
    id: 'energy',
    label: 'Energy',
    description: 'Beta waves for alertness and motivation',
    gradient: 'from-orange-500 to-red-500',
    backendKey: 'Mood Boost'
  }
]

const AIDJPage: React.FC = () => {
  const { playFromGoal, isLoading } = useAudioStore()

  const handleGoalClick = async (goalId: string) => {
    const goal = therapeuticGoals.find(g => g.id === goalId)
    if (!goal) {
      toast({
        title: "Error",
        description: "Invalid therapeutic goal selected",
        variant: "destructive"
      })
      return
    }

    if (isLoading) {
      toast({
        title: "Please wait",
        description: "Already loading music, please wait...",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Starting Session",
      description: `Preparing therapeutic ${goal.label.toLowerCase()} session…`,
    })

    try {
      console.log('🎵 Starting therapeutic session:', goal.label, 'backend key:', goal.backendKey)
      await playFromGoal(goal.backendKey)
      
      toast({
        title: "Session Started",
        description: `Playing therapeutically ordered ${goal.label.toLowerCase()} tracks`,
      })
    } catch (error: any) {
      console.error('❌ Session start failed:', error)
      toast({
        title: "Session Failed",
        description: error.message ?? "Could not load therapeutic tracks",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">AI DJ</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let our AI curate the perfect therapeutic playlist for your current mood and goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {therapeuticGoals.map((goal) => (
            <Card
              key={goal.id}
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden relative",
                `bg-gradient-to-br ${goal.gradient}`,
                isLoading && "opacity-50 pointer-events-none"
              )}
              onClick={() => handleGoalClick(goal.id)}
            >
              <div className="p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm">
                    <Radio className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{goal.label}</h3>
                    <p className="text-white/80 mt-1">{goal.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <Badge className="bg-black/20 text-white border-white/20 hover:bg-black/30">
                    AI Curated
                  </Badge>
                  <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Start Session</span>
                    <Play className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AIDJPage