import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { pipeline } from '@huggingface/transformers';
import { API } from '@/lib/api';
import { usePlayerStore } from '@/stores/playerStore';

interface ClassificationResult {
  label: string;
  score: number;
}

interface HuggingFaceResults {
  text: string;
  primaryClassification: ClassificationResult;
  allClassifications: ClassificationResult[];
  timestamp: string;
  recommendedMood?: string;
}

const HuggingFaceClassifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<HuggingFaceResults | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const { playPlaylist } = usePlayerStore();

  // Map emotion classifications to moods
  const emotionToMoodMap: Record<string, string> = {
    'LABEL_0': 'chill', // negative -> chill/relaxing
    'LABEL_1': 'energy', // positive -> energy/uplifting
    'sadness': 'chill',
    'joy': 'energy',
    'anger': 'focus',
    'fear': 'sleep',
    'surprise': 'energy',
    'disgust': 'focus',
    'happy': 'energy',
    'sad': 'chill',
    'excited': 'energy',
    'calm': 'sleep',
    'anxious': 'focus',
    'relaxed': 'chill'
  };

  const getMoodFromClassification = (classification: ClassificationResult): string => {
    const label = classification.label.toLowerCase();
    
    // Check direct mapping first
    if (emotionToMoodMap[label]) {
      return emotionToMoodMap[label];
    }

    // Check if label contains keywords
    if (label.includes('positive') || label.includes('joy') || label.includes('happy')) {
      return 'energy';
    }
    if (label.includes('negative') || label.includes('sad') || label.includes('calm')) {
      return 'chill';
    }
    if (label.includes('focus') || label.includes('concentrated')) {
      return 'focus';
    }
    if (label.includes('sleep') || label.includes('tired') || label.includes('peaceful')) {
      return 'sleep';
    }

    // Default fallback based on score
    return classification.score > 0.7 ? 'energy' : 'chill';
  };

  const handleClassify = async () => {
    if (!input.trim()) return;

    setIsClassifying(true);
    setError(null);
    setIsModelLoading(true);

    try {
      console.log('Starting HuggingFace classification for:', input);

      // Try different device configurations with fallbacks
      let classifier;
      try {
        // Try WebGPU first
        classifier = await pipeline(
          'text-classification', 
          'cardiffnlp/twitter-roberta-base-emotion-latest',
          { 
            device: 'webgpu',
            dtype: 'fp32'
          }
        );
      } catch (webgpuError) {
        console.log('WebGPU not available, trying WASM...');
        try {
          // Fallback to WASM
          classifier = await pipeline(
            'text-classification', 
            'cardiffnlp/twitter-roberta-base-emotion-latest',
            { 
              device: 'wasm',
              dtype: 'fp32'
            }
          );
        } catch (wasmError) {
          console.log('WASM not available, using default...');
          // Final fallback - let the library choose
          classifier = await pipeline(
            'text-classification', 
            'cardiffnlp/twitter-roberta-base-emotion-latest'
          );
        }
      }

      setIsModelLoading(false);

      const classifications = await classifier(input);
      console.log('HuggingFace classification results:', classifications);

      // Handle both single result and array results
      const classificationArray = Array.isArray(classifications) ? classifications : [classifications];
      
      if (classificationArray && classificationArray.length > 0) {
        const primaryClassification = classificationArray[0] as ClassificationResult;
        const recommendedMood = getMoodFromClassification(primaryClassification);

        const resultsData: HuggingFaceResults = {
          text: input,
          primaryClassification,
          allClassifications: classificationArray as ClassificationResult[],
          timestamp: new Date().toISOString(),
          recommendedMood
        };

        setResults(resultsData);
        console.log('Processed results:', resultsData);
      } else {
        throw new Error('No classification results returned');
      }

    } catch (error) {
      console.error('HuggingFace Classification Error:', error);
      setError(error instanceof Error ? error.message : 'Classification failed');
      setIsModelLoading(false);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleGeneratePlaylist = async () => {
    if (!results?.recommendedMood) return;

    try {
      const playlist = await API.playlistByGoal(results.recommendedMood);
      const tracks = playlist.tracks || [];
      if (tracks.length > 0) {
        playPlaylist(tracks, `${results.recommendedMood} (AI Recommended)`);
      }
    } catch (error) {
      console.error('Error generating playlist:', error);
    }
  };

  const getEmotionColor = (label: string): string => {
    const colorMap: Record<string, string> = {
      'joy': 'bg-blue-500',
      'happiness': 'bg-blue-500',
      'sadness': 'bg-gray-500',
      'anger': 'bg-red-500',
      'fear': 'bg-gray-600',
      'surprise': 'bg-green-500',
      'disgust': 'bg-gray-500',
      'optimism': 'bg-orange-500',
      'love': 'bg-pink-500'
    };

    const label_lower = label.toLowerCase();
    for (const [emotion, color] of Object.entries(colorMap)) {
      if (label_lower.includes(emotion)) {
        return color;
      }
    }
    
    return 'bg-primary';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Mood Analyzer
          <Sparkles className="h-4 w-4 text-blue-500" />
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe how you're feeling and get personalized music recommendations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I'm feeling excited about my new project..."
            className="text-base"
            onKeyPress={(e) => e.key === 'Enter' && handleClassify()}
            disabled={isClassifying}
          />
          
          <Button 
            onClick={handleClassify}
            disabled={isClassifying || !input.trim()}
            className="w-full"
          >
            {isClassifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isModelLoading ? 'Loading AI Model...' : 'Analyzing Mood...'}
              </>
            ) : (
              <>
                <Bot className="h-4 w-4 mr-2" />
                Analyze Mood
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isModelLoading && (
          <Card className="p-4 bg-muted/50">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Loading AI Model</p>
                <p className="text-sm text-muted-foreground">
                  This may take a moment on first use...
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-4 border-destructive bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Analysis Failed</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </Card>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Primary Emotion</h3>
                  <Badge variant="secondary" className="font-mono">
                    {(results.primaryClassification.score * 100).toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${getEmotionColor(results.primaryClassification.label)}`}
                    />
                    <span className="font-medium capitalize">
                      {results.primaryClassification.label.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <Progress 
                    value={results.primaryClassification.score * 100} 
                    className="h-2"
                  />
                </div>

                {results.recommendedMood && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Recommended Music Mood:
                      </span>
                      <Badge className="capitalize">
                        {results.recommendedMood}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* All Classifications */}
            {results.allClassifications.length > 1 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Detailed Analysis</h3>
                <div className="space-y-2">
                  {results.allClassifications.slice(0, 5).map((classification, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-2 h-2 rounded-full ${getEmotionColor(classification.label)}`}
                        />
                        <span className="text-sm capitalize">
                          {classification.label.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${classification.score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {(classification.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Music Recommendation Button */}
            {results.recommendedMood && (
              <Button 
                onClick={handleGeneratePlaylist}
                className="w-full"
                variant="default"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {results.recommendedMood} Playlist
              </Button>
            )}

            {/* Timestamp */}
            <p className="text-xs text-muted-foreground text-center">
              Analysis completed at {new Date(results.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Example Prompts */}
        {!results && !isClassifying && (
          <Card className="p-4 bg-muted/30">
            <h4 className="font-medium mb-2">Try these examples:</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                "I'm feeling stressed about work and need to focus",
                "I'm excited and energetic today!",
                "I feel calm and want to relax",
                "I'm tired and need help falling asleep"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput(example)}
                  className="justify-start text-left h-auto p-2 text-sm"
                >
                  "{example}"
                </Button>
              ))}
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default HuggingFaceClassifier;