import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  THERAPEUTIC_USE_CASES, 
  TherapeuticUseCaseManager,
  type TherapeuticUseCase 
} from '@/services/therapeuticUseCases';
import { useTherapeuticSession } from '@/hooks/useTherapeuticSession';
import { useAudioStore } from '@/stores/audioStore';
import { 
  Brain, 
  Heart, 
  Moon, 
  Zap, 
  Shield, 
  Activity,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  Square,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface TherapeuticUseCaseSelectorProps {
  className?: string;
  onSessionStart?: (session: any) => void;
}

const CATEGORY_ICONS = {
  clinical: Heart,
  wellness: Shield,
  performance: Zap,
  recovery: Moon
} as const;

const CATEGORY_COLORS = {
  clinical: 'bg-red-50 text-red-700 border-red-200',
  wellness: 'bg-green-50 text-green-700 border-green-200',
  performance: 'bg-blue-50 text-blue-700 border-blue-200',
  recovery: 'bg-purple-50 text-purple-700 border-purple-200'
} as const;

export function TherapeuticUseCaseSelector({ className, onSessionStart }: TherapeuticUseCaseSelectorProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<TherapeuticUseCase | null>(null);
  const [duration, setDuration] = useState<number[]>([30]);
  const [intensity, setIntensity] = useState<number[]>([5]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  const audioStore = useAudioStore();
  const {
    currentSession,
    isActive,
    progress,
    outcomes,
    startSession,
    endSession,
    togglePause,
    recordMeasurement,
    getCurrentPhaseInfo,
    validateProgress,
    isPaused,
    effectiveness,
    timeRemaining
  } = useTherapeuticSession();

  const handleUseCaseSelect = (useCase: TherapeuticUseCase) => {
    if (isActive) {
      toast.error('Please end current session before starting a new one');
      return;
    }
    
    setSelectedUseCase(useCase);
    setIsConfiguring(true);
    
    // Set optimal defaults based on use case
    const optimal = useCase.sessionStructure.totalDuration.optimal;
    const midIntensity = Math.floor((useCase.sessionStructure.intensityRange.min + useCase.sessionStructure.intensityRange.max) / 2);
    
    setDuration([optimal]);
    setIntensity([midIntensity]);
  };

  const handleStartSession = async () => {
    if (!selectedUseCase) return;

    const tracks = audioStore.queue || [];
    if (tracks.length === 0) {
      toast.error('No tracks available. Please load some music first.');
      return;
    }

    const success = await startSession(
      selectedUseCase.id,
      duration[0],
      intensity[0],
      tracks
    );

    if (success) {
      setIsConfiguring(false);
      onSessionStart?.(currentSession);
    }
  };

  const handleEndSession = () => {
    endSession(true);
    setSelectedUseCase(null);
    setIsConfiguring(false);
  };

  const currentPhase = getCurrentPhaseInfo();
  const validation = validateProgress();

  if (isActive && currentSession) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {currentSession.useCase.name}
              </CardTitle>
              <CardDescription>
                Active Therapeutic Session
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              {currentPhase ? currentPhase.name : 'In Progress'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Session Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress.overallProgress * 100)}%</span>
            </div>
            <Progress value={progress.overallProgress * 100} className="h-2" />
            
            {currentPhase && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Current Phase: {currentPhase.name}</span>
                  <span>{Math.round(currentPhase.progress * 100)}%</span>
                </div>
                <Progress value={currentPhase.progress * 100} className="h-1" />
              </>
            )}
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <Target className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">
                {Math.round(effectiveness * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Effectiveness</div>
            </div>
          </div>

          {/* Phase Information */}
          {currentPhase && (
            <Alert>
              <Brain className="w-4 h-4" />
              <AlertDescription>
                <strong>Current Focus:</strong> {currentPhase.purpose}
                <br />
                <strong>Target State:</strong> Valence {currentPhase.vadTargets.valence.target.toFixed(2)}, 
                Arousal {currentPhase.vadTargets.arousal.target.toFixed(2)}
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Alerts */}
          {validation && !validation.isOnTrack && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Session Alert:</strong> {validation.recommendations.join(', ')}
                <br />
                <strong>Suggestions:</strong> {validation.adjustments.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Session Controls */}
          <div className="flex gap-2">
            <Button 
              variant={isPaused ? "default" : "secondary"}
              size="sm"
              onClick={togglePause}
              className="flex-1"
            >
              {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleEndSession}
            >
              <Square className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>

          {/* Quick Measurement */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How are you feeling? (1-10)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => recordMeasurement('Current Mood', value)}
                  className="w-8 h-8 p-0"
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConfiguring && selectedUseCase) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Configure {selectedUseCase.name}
          </CardTitle>
          <CardDescription>{selectedUseCase.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Use Case Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Target Conditions</h4>
              <div className="flex flex-wrap gap-1">
                {selectedUseCase.targetConditions.map(condition => (
                  <Badge key={condition} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedUseCase.contraindications.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Contraindications</h4>
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    Not recommended for: {selectedUseCase.contraindications.join(', ')}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          <Separator />

          {/* Session Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration: {duration[0]} minutes
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={selectedUseCase.sessionStructure.totalDuration.min}
                max={selectedUseCase.sessionStructure.totalDuration.max}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{selectedUseCase.sessionStructure.totalDuration.min}min</span>
                <span>Optimal: {selectedUseCase.sessionStructure.totalDuration.optimal}min</span>
                <span>{selectedUseCase.sessionStructure.totalDuration.max}min</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Intensity: {intensity[0]}/10
              </label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                min={selectedUseCase.sessionStructure.intensityRange.min}
                max={selectedUseCase.sessionStructure.intensityRange.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Gentle</span>
                <span>Moderate</span>
                <span>Intensive</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Session Phases Preview */}
          <div>
            <h4 className="font-medium mb-3">Session Structure</h4>
            <div className="space-y-2">
              {selectedUseCase.sessionStructure.phases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{phase.name}</div>
                    <div className="text-xs text-muted-foreground">{phase.purpose}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{phase.duration}min</div>
                    <div className="text-xs text-muted-foreground">
                      {phase.bpmRange.min}-{phase.bpmRange.max} BPM
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Expected Outcomes */}
          <div>
            <h4 className="font-medium mb-2">Expected Outcomes</h4>
            <div className="space-y-1">
              {selectedUseCase.measurableOutcomes.slice(0, 3).map(outcome => (
                <div key={outcome.name} className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-muted-foreground">{outcome.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsConfiguring(false)} className="flex-1">
              Back to Selection
            </Button>
            <Button onClick={handleStartSession} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Therapeutic Use Cases
        </CardTitle>
        <CardDescription>
          Select a scientifically-designed therapeutic pathway for your specific needs
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          {THERAPEUTIC_USE_CASES.map(useCase => {
            const CategoryIcon = CATEGORY_ICONS[useCase.category];
            const categoryColor = CATEGORY_COLORS[useCase.category];
            
            return (
              <Card 
                key={useCase.id}
                className="cursor-pointer transition-all hover:shadow-md hover:bg-muted/50"
                onClick={() => handleUseCaseSelect(useCase)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${categoryColor}`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{useCase.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {useCase.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {useCase.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {useCase.targetConditions.slice(0, 3).map(condition => (
                          <Badge key={condition} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {useCase.targetConditions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{useCase.targetConditions.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {useCase.sessionStructure.totalDuration.min}-{useCase.sessionStructure.totalDuration.max}min
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {useCase.sessionStructure.phases.length} phases
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {useCase.measurableOutcomes.length} metrics
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}