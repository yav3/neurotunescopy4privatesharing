import React, { useState, useEffect } from 'react';
import AudioTester from '@/components/AudioTester'
import AudioAnalysisRunner from '@/components/AudioAnalysisRunner'
import { StorageAudit } from "@/components/StorageAudit";
import { ComprehensiveAudioAnalyzer } from "@/components/ComprehensiveAudioAnalyzer";
import { useAudioStore } from '../stores';
import { API } from '../lib/api';
import { buildStreamUrl, headOk } from '../lib/stream';

const AudioDiagnostics: React.FC = () => {
  const { playTrack, pause, isPlaying, currentTrack } = useAudioStore();
  const [realTracks, setRealTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load REAL tracks directly from tracks table (unified system)
  useEffect(() => {
    const loadRealTracks = async () => {
      try {
        console.log('🔍 Loading REAL tracks from tracks database...');
        
        // Import supabase and query tracks table directly
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data: tracks, error } = await supabase
          .from('tracks')
          .select('id, title, file_path, storage_key, bpm, energy_level, valence, genre')
          .eq('audio_status', 'working')
          .limit(4);
        
        if (error) {
          throw error;
        }
        
        console.log('✅ Loaded real tracks with storage info:', tracks?.map(t => ({
          id: t.id, 
          title: t.title, 
          file_path: t.file_path, 
          storage_key: t.storage_key,
          energy: t.energy_level
        })));
        
        setRealTracks(tracks || []);
      } catch (error) {
        console.error('❌ Failed to load real tracks from database:', error);
        setRealTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadRealTracks();
  }, []);

  const testAPIHealth = async () => {
    try {
      const result = await API.health();
      alert(`API Health: ✅ PASS\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      alert(`API Health: ❌ FAIL\n${error}`);
    }
  };

  const testHeadCheck = async (track: any) => {
    try {
      console.log(`🧪 Testing HEAD check for REAL track:`, track);
      const url = buildStreamUrl(track.id);
      const ok = await headOk(url);
      alert(`HEAD Test: ${ok ? '✅ PASS' : '❌ FAIL'}\nTrack: "${track.title}"\nUUID: ${track.id}\nURL: ${url}`);
    } catch (error) {
      alert(`HEAD Test: ❌ ERROR\n${error}`);
    }
  };

  const handlePlay = async (track: any) => {
    try {
      console.log(`🎵 Playing REAL track:`, track);
      await playTrack(track);
    } catch (error) {
      console.error('❌ Play failed:', error);
      alert(`Play Test: ❌ FAIL\nTrack: "${track.title}"\nError: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Audio Diagnostics & Analysis</h1>
      
      {/* Audio Analysis Pipeline */}
      <AudioAnalysisRunner />
      
      {/* Storage Audit */}
          <ComprehensiveAudioAnalyzer />
          <StorageAudit />
      
      {/* Front-to-Back Audio Testing */}
      <AudioTester />
      
      {/* Legacy Track Testing */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">Legacy Track Testing</h2>
        <p className="text-sm text-muted-foreground mb-4">Testing with REAL tracks from tracks database</p>
        
        <div className="space-y-4">
          <button
            onClick={testAPIHealth}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            🏥 Test API Health
          </button>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">🎵 Real Track Tests</h3>
            
            {loading ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800">🔍 Loading tracks from database...</p>
              </div>
            ) : realTracks.length === 0 ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">❌ No tracks found in tracks table</p>
                <p className="text-sm text-red-600 mt-1">Check if tracks exist in database</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <p className="text-green-800">✅ Found {realTracks.length} real tracks with UUIDs</p>
                </div>
                
                {realTracks.map((track) => (
                  <div key={track.id} className="p-3 border rounded bg-gray-50">
                    <div className="mb-2">
                      <p className="font-medium text-gray-900">{track.title}</p>
                      <p className="text-xs text-gray-600">Genre: {track.genre} • Energy: {track.energy_level}</p>
                      <p className="text-xs text-gray-500 font-mono">UUID: {track.id}</p>
                      <p className="text-xs text-blue-600">Storage: {track.file_path || track.storage_key}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => testHeadCheck(track)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 font-medium"
                      >
                        🔍 HEAD Test
                      </button>
                      
                      <button
                        onClick={() => handlePlay(track)}
                        disabled={isPlaying && currentTrack?.id === track.id}
                        className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:opacity-50 font-medium"
                      >
                        {isPlaying && currentTrack?.id === track.id ? '▶️ Playing...' : '▶️ Play'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <button
              onClick={pause}
              className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
            >
              ⏸️ Stop All Audio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDiagnostics;