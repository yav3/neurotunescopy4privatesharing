import React, { useState, useEffect } from 'react'
import { Play, Clock, Target, Brain, Heart, Moon, Focus, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useQuery } from '@tanstack/react-query'
import { SupabaseService } from '@/services/supabase'
import { TherapeuticEngine, type TherapeuticGoal, type SessionConfig } from '@/services/therapeuticEngine'
import { useAudio } from '@/context/AudioContext'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ui/use-toast'

const THERAPEUTIC_GOALS = [
  {
    id: 'anxiety_relief' as TherapeuticGoal,
    name: 'Anxiety Relief',
    icon: Shield,
    description: 'Calm your mind and reduce anxious thoughts',
    color: 'bg-blue-500/20 text-blue-700 border-blue-300'
  },
  {
    id: 'focus_enhancement' as TherapeuticGoal,
    name: 'Focus Enhancement', 
    icon: Focus,
    description: 'Improve concentration and mental clarity',
    color: 'bg-purple-500/20 text-purple-700 border-purple-300'
  },
  {
    id: 'sleep_preparation' as TherapeuticGoal,
    name: 'Sleep Preparation',
    icon: Moon,
    description: 'Wind down and prepare for restful sleep',
    color: 'bg-indigo-500/20 text-indigo-700 border-indigo-300'
  },
  {
    id: 'mood_boost' as TherapeuticGoal,
    name: 'Mood Boost',
    icon: Heart,
    description: 'Elevate your mood and increase positivity',
    color: 'bg-pink-500/20 text-pink-700 border-pink-300'
  },
  {
    id: 'stress_reduction' as TherapeuticGoal,
    name: 'Stress Reduction',
    icon: Brain,
    description: 'Release tension and promote relaxation',
    color: 'bg-green-500/20 text-green-700 border-green-300'
  },
  {
    id: 'meditation_support' as TherapeuticGoal,
    name: 'Meditation Support',
    icon: Zap,
    description: 'Enhance mindfulness and meditation practice',
    color: 'bg-orange-500/20 text-orange-700 border-orange-300'
  }
]

interface TherapeuticSessionBuilderProps {
  onSessionStart: (tracks: any[]) => void
  className?: string
}

export const TherapeuticSessionBuilder: React.FC<TherapeuticSessionBuilderProps> = ({
  onSessionStart,
  className = ''
}) => {
  const [selectedGoal, setSelectedGoal] = useState<TherapeuticGoal>('anxiety_relief')
  const [duration, setDuration] = useState([15])
  const [intensity, setIntensity] = useState([3])
  const [isBuilding, setIsBuilding] = useState(false)
  const { toast } = useToast()

  // Fetch available tracks
  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['therapeutic-tracks'],
    queryFn: () => SupabaseService.fetchTracks({ limit: 100 }),
    staleTime: 10 * 60 * 1000 // 10 minutes
  })

  const handleBuildSession = async () => {
    if (tracks.length === 0) {
      toast({
        title: "No Tracks Available",
        description: "Please wait while tracks are loaded or upload some tracks first.",
        variant: "destructive"
      })
      return
    }

    setIsBuilding(true)

    try {
      const config: SessionConfig = {
        goal: selectedGoal,
        duration: duration[0],
        intensityLevel: intensity[0] as 1 | 2 | 3 | 4 | 5
      }

      const session = await TherapeuticEngine.createSession(config, tracks)
      
      toast({
        title: "Session Created",
        description: `Built ${session.tracks.length} track session for ${session.goal.replace('_', ' ')}`,
      })

      onSessionStart(session.tracks)
    } catch (error) {
      console.error('Failed to build session:', error)
      toast({
        title: "Session Build Failed",
        description: error instanceof Error ? error.message : "Failed to create therapeutic session",
        variant: "destructive"
      })
    } finally {
      setIsBuilding(false)
    }
  }

  const selectedGoalInfo = THERAPEUTIC_GOALS.find(g => g.id === selectedGoal)

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <LoadingSpinner text="Loading therapeutic options..." />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Build Your Therapeutic Session
        </h2>
        <p className="text-muted-foreground">
          Personalized music therapy based on scientific research and harmonic progression
        </p>
      </div>

      {/* Goal Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Select Your Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {THERAPEUTIC_GOALS.map((goal) => {
            const Icon = goal.icon
            const isSelected = selectedGoal === goal.id
            
            return (
              <Card
                key={goal.id}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => setSelectedGoal(goal.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${goal.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {goal.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Session Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Session Duration
            </h3>
          </div>
          <div className="space-y-3">
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>5 min</span>
              <span className="font-medium text-foreground">
                {duration[0]} minutes
              </span>
              <span>60 min</span>
            </div>
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Intensity Level
            </h3>
          </div>
          <div className="space-y-3">
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Gentle</span>
              <span className="font-medium text-foreground">
                Level {intensity[0]}
              </span>
              <span>Intense</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Preview */}
      {selectedGoalInfo && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${selectedGoalInfo.color}`}>
              <selectedGoalInfo.icon size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {selectedGoalInfo.name} Session
              </h3>
              <p className="text-muted-foreground">
                {selectedGoalInfo.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock size={14} />
              {duration[0]} minutes
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target size={14} />
              Intensity {intensity[0]}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain size={14} />
              {tracks.length} tracks available
            </Badge>
          </div>

          <Button
            onClick={handleBuildSession}
            disabled={isBuilding || tracks.length === 0}
            className="w-full h-12 text-lg font-semibold"
          >
            {isBuilding ? (
              <>
                <LoadingSpinner className="mr-2" />
                Building Session...
              </>
            ) : (
              <>
                <Play size={20} className="mr-2" />
                Start Therapeutic Session
              </>
            )}
          </Button>
        </Card>
      )}

      {/* Track Library Status */}
      <div className="text-center text-sm text-muted-foreground">
        {tracks.length > 0 ? (
          <p>✓ {tracks.length} therapeutic tracks loaded and ready</p>
        ) : (
          <p>⚠️ No tracks available - please upload music files first</p>
        )}
      </div>
    </div>
  )
}