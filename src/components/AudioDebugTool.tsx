import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AudioDebugTool() {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState([]);
  const audioRef = useRef(null);
  
  const addResult = (test, result, details = '') => {
    const newResult = {
      test,
      result,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [...prev, newResult]);
    console.log(`🧪 ${test}: ${result}`, details);
  };

  // Test 1: Basic HTML Audio Element
  const testBasicAudio = () => {
    try {
      const audio = new Audio();
      addResult('Basic Audio Element', '✅ PASS', 'Audio constructor works');
      
      // Test with a simple test file
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmceAjiS2ey7fCgEKXfm7OeUOA8YMY3M8OiONw4aN3HN7tqZPAwZQpDPuu25dykEKnLm7OeXOw8VMZfIz+KROgsRQ4rVud23ayIFJ3nE7tyZPA4VQY3Pue24cyIFJnLm7OeYOw4VPZrOz+qXOw4VMZnJz+OXOhAURYjRue62ZyEFJnXjz+OhQhcNTYXaw9uuUSERXqXn4bddHAY+ktjxwngpBCSFzuHRg0U2HYNNOHCPNKCoQDp2TUKNgIqlIFKOo='
      
      audio.addEventListener('loadstart', () => addResult('Audio Load', '🔄 LOADING', 'Load started'));
      audio.addEventListener('canplay', () => addResult('Audio Load', '✅ CAN PLAY', 'Audio ready to play'));
      audio.addEventListener('error', (e) => {
        addResult('Audio Load', '❌ ERROR', `Error: ${audio.error?.message || 'Unknown error'}`);
      });
      
      audioRef.current = audio;
      
    } catch (error) {
      addResult('Basic Audio Element', '❌ FAIL', error.message);
    }
  };

  // Test 2: User Interaction (Required for autoplay)
  const testUserInteraction = async () => {
    try {
      if (!audioRef.current) {
        addResult('User Interaction', '❌ FAIL', 'No audio element');
        return;
      }
      
      const audio = audioRef.current;
      const playPromise = audio.play();
      
      if (playPromise) {
        await playPromise;
        addResult('User Interaction', '✅ PASS', 'Audio played successfully');
        
        // Stop it after 1 second
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 1000);
      } else {
        addResult('User Interaction', '❌ FAIL', 'Play returned undefined');
      }
      
    } catch (error) {
      addResult('User Interaction', '❌ FAIL', error.message);
    }
  };

  // Test 3: Supabase Storage Access
  const testSupabaseStorage = async () => {
    try {
      // Use the existing Supabase client
      const { supabase } = await import('@/integrations/supabase/client');
      
      addResult('Supabase Client', '✅ PASS', 'Client created');
      
      // Try to create a signed URL for a known file
      const { data, error } = await supabase.storage
        .from('neuralpositivemusic')
        .createSignedUrl('anamaria_ambient_dance_edm_128_bpm_2.mp3', 60);
      
      if (error) {
        addResult('Signed URL', '❌ FAIL', error.message);
        return;
      }
      
      if (data?.signedUrl) {
        addResult('Signed URL', '✅ PASS', `URL: ${data.signedUrl.substring(0, 50)}...`);
        
        // Test if the URL actually works
        const audio = new Audio();
        audio.src = data.signedUrl;
        
        audio.addEventListener('loadstart', () => {
          addResult('Real File Load', '🔄 LOADING', 'Started loading real file');
        });
        
        audio.addEventListener('canplay', () => {
          addResult('Real File Load', '✅ CAN PLAY', 'Real audio file ready');
        });
        
        audio.addEventListener('error', (e) => {
          addResult('Real File Load', '❌ ERROR', `Real file error: ${audio.error?.message}`);
        });
        
        audioRef.current = audio;
        
      } else {
        addResult('Signed URL', '❌ FAIL', 'No signed URL returned');
      }
      
    } catch (error) {
      addResult('Supabase Storage', '❌ FAIL', error.message);
    }
  };

  // Test 4: Browser Audio Capabilities
  const testBrowserCapabilities = () => {
    const audio = new Audio();
    const capabilities = {
      'MP3 Support': audio.canPlayType('audio/mpeg'),
      'WAV Support': audio.canPlayType('audio/wav'),
      'OGG Support': audio.canPlayType('audio/ogg'),
      'M4A Support': audio.canPlayType('audio/mp4'),
      'Web Audio API': !!window.AudioContext || !!(window as any).webkitAudioContext,
      'Autoplay Policy': (navigator as any).getAutoplayPolicy ? (navigator as any).getAutoplayPolicy('mediaelement') : 'unknown'
    };
    
    Object.entries(capabilities).forEach(([test, result]) => {
      const status = result ? '✅ SUPPORTED' : '❌ NOT SUPPORTED';
      addResult('Browser Capability', status, `${test}: ${result}`);
    });
  };

  // Test 5: Network Connectivity
  const testNetworkConnectivity = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
        method: 'HEAD'
      });
      
      if (response.ok) {
        addResult('Network', '✅ PASS', 'Supabase accessible');
      } else {
        addResult('Network', '❌ FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult('Network', '❌ FAIL', error.message);
    }
  };

  // Play the currently loaded audio
  const playCurrentAudio = async () => {
    if (!audioRef.current) {
      addResult('Play Current', '❌ FAIL', 'No audio loaded');
      return;
    }
    
    try {
      await audioRef.current.play();
      addResult('Play Current', '✅ PLAYING', 'Audio started playing');
    } catch (error) {
      addResult('Play Current', '❌ FAIL', error.message);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    addResult('Test Suite', '🧪 STARTING', 'Running all audio tests...');
    
    testBasicAudio();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testBrowserCapabilities();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testNetworkConnectivity();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testSupabaseStorage();
    
    addResult('Test Suite', '✅ COMPLETE', 'All tests finished');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Audio Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runAllTests} variant="default">
              🧪 Run All Tests
            </Button>
            <Button onClick={testBasicAudio} variant="outline">
              Test Basic Audio
            </Button>
            <Button onClick={testUserInteraction} variant="outline">
              Test User Interaction
            </Button>
            <Button onClick={testSupabaseStorage} variant="outline">
              Test Supabase Storage
            </Button>
            <Button onClick={playCurrentAudio} variant="outline">
              ▶️ Play Current Audio
            </Button>
            <Button onClick={clearResults} variant="destructive" size="sm">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-muted-foreground">No tests run yet. Click "Run All Tests" to start.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="p-2 border rounded text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{result.test}</span>
                    <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                  </div>
                  <div className="font-mono text-xs">
                    {result.result}
                  </div>
                  {result.details && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 Debug Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>Step 1:</strong> Click "Run All Tests" to diagnose the issue</p>
            <p><strong>Step 2:</strong> Look for ❌ FAIL results to identify problems</p>
            <p><strong>Step 3:</strong> Try "Test User Interaction" - modern browsers require user click for audio</p>
            <p><strong>Step 4:</strong> Check browser console for additional error messages</p>
            <p><strong>Step 5:</strong> If storage test passes, try "Play Current Audio"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}