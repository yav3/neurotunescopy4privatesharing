import React, { useState } from 'react'
import { Play, Pause, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { SupabaseService } from '@/services/supabase'
import { logger } from '@/services/logger'

interface AudioTestResult {
  trackId: string
  title: string
  filePath: string
  bucketName: string
  url?: string
  status: 'testing' | 'success' | 'error'
  error?: string
}

export const AudioTester: React.FC = () => {
  const [testResults, setTestResults] = useState<AudioTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const testTrack = async (track: any): Promise<AudioTestResult> => {
    const result: AudioTestResult = {
      trackId: track.id,
      title: track.title,
      filePath: track.file_path,
      bucketName: track.bucket_name || 'neuralpositivemusic',
      status: 'testing'
    }

    try {
      // Test URL generation
      const url = await SupabaseService.getTrackUrl(result.filePath, result.bucketName)
      result.url = url

      // Test if URL is accessible
      const response = await fetch(url, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Test actual audio loading
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      
      return new Promise<AudioTestResult>((resolve) => {
        const timeout = setTimeout(() => {
          result.status = 'error'
          result.error = 'Loading timeout (10s)'
          resolve(result)
        }, 10000)

        const handleCanPlay = () => {
          clearTimeout(timeout)
          result.status = 'success'
          audio.remove()
          resolve(result)
        }

        const handleError = () => {
          clearTimeout(timeout)
          result.status = 'error'
          result.error = `Audio load error: ${audio.error?.message || 'Unknown error'}`
          audio.remove()
          resolve(result)
        }

        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('error', handleError)
        audio.src = url
        audio.load()
      })

    } catch (error) {
      result.status = 'error'
      result.error = error instanceof Error ? error.message : 'Unknown error'
      return result
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    try {
      // Get sample tracks from different genres
      const ambientTracks = await SupabaseService.fetchTracks({ genre: 'ambient', limit: 2 })
      const classicalTracks = await SupabaseService.fetchTracks({ genre: 'classical', limit: 2 })
      
      const allTracks = [...ambientTracks, ...classicalTracks]
      
      logger.info('Starting audio delivery tests', { trackCount: allTracks.length })

      // Test each track
      for (const track of allTracks) {
        const result = await testTrack(track)
        setTestResults(prev => [...prev, result])
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500))
      }

    } catch (error) {
      logger.error('Audio test failed', { error })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: AudioTestResult['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 size={16} className="animate-spin text-music-energy" />
      case 'success':
        return <CheckCircle size={16} className="text-music-mood" />
      case 'error':
        return <AlertTriangle size={16} className="text-destructive" />
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Audio Delivery Test</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors"
        >
          {isRunning ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play size={18} />
              Run Tests
            </>
          )}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="mb-4 p-3 bg-secondary rounded-lg">
          <div className="text-sm text-muted-foreground">
            Results: {successCount} successful, {errorCount} failed, {testResults.length - successCount - errorCount} testing
          </div>
        </div>
      )}

      <div className="space-y-3">
        {testResults.map((result) => (
          <div
            key={result.trackId}
            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{result.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {result.filePath} → {result.bucketName}
              </p>
              {result.error && (
                <p className="text-sm text-destructive mt-1">{result.error}</p>
              )}
              {result.url && result.status === 'success' && (
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Test URL →
                </a>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {getStatusIcon(result.status)}
              <span className="text-sm text-muted-foreground capitalize">
                {result.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className="text-center py-8">
          <Play size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Click "Run Tests" to check audio delivery</p>
        </div>
      )}
    </div>
  )
}

export default AudioTester