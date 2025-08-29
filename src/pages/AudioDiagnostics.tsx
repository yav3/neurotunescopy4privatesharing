import React from 'react';
import { usePlay } from '../hooks/usePlay';
import { API } from '../lib/api';
import { buildStreamUrl, headOk } from '../lib/stream';

const AudioDiagnostics: React.FC = () => {
  const { safePlay, pause, isPlaying, currentId } = usePlay();

  const testTracks = [
    { id: "test-track-1", title: "Test Track 1" },
    { id: "test-track-2", title: "Test Track 2" }
  ];

  const handlePlay = async (trackId: string) => {
    try {
      await safePlay(trackId);
    } catch (error) {
      console.error('Play failed:', error);
      alert(`Play failed: ${error}`);
    }
  };

  const testHealthCheck = async () => {
    try {
      const result = await API.health();
      alert(`Health check passed: ${JSON.stringify(result)}`);
    } catch (error) {
      alert(`Health check failed: ${error}`);
    }
  };

  const testHeadCheck = async (trackId: string) => {
    try {
      const url = buildStreamUrl(trackId);
      const ok = await headOk(url);
      alert(`HEAD check for ${trackId}: ${ok ? 'PASS' : 'FAIL'} (${url})`);
    } catch (error) {
      alert(`HEAD check failed: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audio Diagnostics</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testHealthCheck}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Health Check
        </button>

        {testTracks.map(track => (
          <div key={track.id} className="border p-4 rounded">
            <h3 className="font-medium mb-2">{track.title}</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePlay(track.id)}
                disabled={isPlaying && currentId === track.id}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isPlaying && currentId === track.id ? 'Playing...' : 'Play'}
              </button>
              <button 
                onClick={() => testHeadCheck(track.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                HEAD Check
              </button>
            </div>
          </div>
        ))}

        {isPlaying && (
          <button 
            onClick={pause}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioDiagnostics;