import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AudioUrlDebugger, createUrlTestsFromFileList, AudioUrlTest } from '@/utils/audioUrlDebugger';
import { toast } from 'sonner';

// Sample data from your file list for testing
const sampleFileList = [
  { bucket: "neuralpositivemusic", original: "Alternative-frequencies,-2_-instrumental_-relaxation.mp3", encoded: "Alternative-frequencies%2C-2_-instrumental_-relaxation.mp3" },
  { bucket: "ENERGYBOOST", original: "118; Pop, EDM, Funk; Re-Energize (Remix).mp3", encoded: "118%3B%20%20Pop%2C%20EDM%2C%20Funk%3B%20Re-Energize%20(Remix).mp3" },
  { bucket: "ENERGYBOOST", original: "Adoration; EDM - classical reimagined; HIIT (1).mp3", encoded: "Adoration%3B%20EDM%20-%20classical%20reimagined%3B%20HIIT%20(1).mp3" },
  { bucket: "samba", original: "Coffee, First; Jazz Samba; Movement 2 (1).mp3", encoded: "Coffee%2C%20First%3B%20Jazz%20Samba%3B%20Movement%202%20(1).mp3" },
  { bucket: "ENERGYBOOST", original: "Arctic Kitties; Alternative; 128 BPM, HIIT, Re-Energize (Remix).mp3", encoded: "Arctic%20Kitties%3B%20Alternative%3B%20128%20BPM%2C%20HIIT%2C%20Re-Energize%20(Remix).mp3" },
];

export const AudioUrlTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AudioUrlTest[]>([]);
  const [progress, setProgress] = useState(0);
  const [customFileList, setCustomFileList] = useState('');

  const runTest = async (fileList: typeof sampleFileList) => {
    setIsLoading(true);
    setResults([]);
    setProgress(0);
    
    try {
      console.log('🧪 Starting audio URL test...');
      toast.info(`Testing ${fileList.length} audio URLs...`);
      
      const urlTests = createUrlTestsFromFileList(fileList);
      
      // Test URLs with progress updates
      const batchSize = 3;
      const results: AudioUrlTest[] = [];
      
      for (let i = 0; i < urlTests.length; i += batchSize) {
        const batch = urlTests.slice(i, i + batchSize);
        const batchResults = await AudioUrlDebugger.testMultipleUrls(batch, batchSize);
        results.push(...batchResults);
        
        // Update progress
        const progressPercent = Math.min(100, ((i + batchSize) / urlTests.length) * 100);
        setProgress(progressPercent);
        setResults([...results]);
      }
      
      // Generate and log report
      const report = AudioUrlDebugger.generateReport(results);
      console.log(report);
      
      const analysis = AudioUrlDebugger.analyzeEncodingIssues(results);
      toast.success(`Test complete! ${analysis.summary.working}/${analysis.summary.total} URLs working (${analysis.summary.workingRate.toFixed(1)}%)`);
      
    } catch (error) {
      console.error('Audio URL test failed:', error);
      toast.error('Audio URL test failed');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const testSampleUrls = () => runTest(sampleFileList);

  const testCustomUrls = () => {
    try {
      const parsed = JSON.parse(customFileList);
      if (Array.isArray(parsed)) {
        runTest(parsed);
      } else {
        toast.error('Custom file list must be an array');
      }
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  const playTestUrl = async (url: string, title: string) => {
    try {
      console.log(`🎵 Testing playback: ${title}`);
      
      // Use the audio store to test playback
      const { useAudioStore } = await import('@/stores/audioStore');
      const audioStore = useAudioStore.getState();
      
      const testTrack = {
        id: `test-${Date.now()}`,
        title: title,
        artist: 'Test',
        duration: 0,
        stream_url: url,
        audio_status: 'working' as const,
        storage_bucket: '',
        storage_key: ''
      };
      
      await audioStore.playTrack(testTrack);
      toast.success(`Playing: ${title}`);
    } catch (error) {
      console.error('Playback test failed:', error);
      toast.error('Playback test failed');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return <Badge variant="default" className="bg-green-500">✅ Working</Badge>;
      case 'failed':
        return <Badge variant="destructive">❌ Failed</Badge>;
      case 'testing':
        return <Badge variant="secondary">🧪 Testing...</Badge>;
      default:
        return <Badge variant="outline">❓ Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🎵 Audio URL Debugger</CardTitle>
        <CardDescription>
          Test and debug audio URL encoding issues. This tool helps identify which URLs are working and which need fixes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Button 
            onClick={testSampleUrls} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            🧪 Test Sample URLs ({sampleFileList.length})
          </Button>
        </div>

        {/* Custom File List Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom File List (JSON):</label>
          <textarea
            value={customFileList}
            onChange={(e) => setCustomFileList(e.target.value)}
            placeholder='[{"bucket": "ENERGYBOOST", "original": "test.mp3", "encoded": "test.mp3"}]'
            className="w-full h-32 p-3 border rounded-md font-mono text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={testCustomUrls} 
            disabled={isLoading || !customFileList.trim()}
            variant="outline"
          >
            🧪 Test Custom URLs
          </Button>
        </div>

        {/* Progress */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Testing URLs...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <div className="text-sm text-muted-foreground">
                {results.filter(r => r.status === 'working').length}/{results.length} working
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {result.bucket}/{result.original}
                    </div>
                    {result.error && (
                      <div className="text-sm text-red-600 truncate">
                        {result.error}
                      </div>
                    )}
                    {result.contentType && (
                      <div className="text-xs text-muted-foreground">
                        {result.contentType} {result.fileSize && `• ${(result.fileSize / 1024 / 1024).toFixed(1)}MB`}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusBadge(result.status)}
                    {result.status === 'working' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playTestUrl(result.publicUrl, result.original)}
                      >
                        ▶️ Play
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Console Instructions */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Console Commands Available:</h4>
          <div className="space-y-1 text-sm font-mono">
            <div><code>testAudioUrl(bucket, filename)</code> - Test a single URL</div>
            <div><code>testMultipleAudioUrls(urlArray)</code> - Test multiple URLs</div>
            <div><code>generateAudioReport(results)</code> - Generate debug report</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};