import React, { useState } from 'react'
import { Play, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'loading'
  message: string
  details?: any
}

export const AudioTester: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const newResults: TestResult[] = []

    // Test 1: Database Connection
    try {
      newResults.push({
        name: 'Database Connection',
        status: 'loading',
        message: 'Testing database connection...'
      })
      setResults([...newResults])

      const response = await fetch('/api/health')
      if (response.ok) {
        const data = await response.json()
        newResults[newResults.length - 1] = {
          name: 'Database Connection',
          status: 'success',
          message: `Connected successfully (${data.status})`,
          details: data
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      newResults[newResults.length - 1] = {
        name: 'Database Connection',
        status: 'error',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      }
    }

    // Test 2: Edge Function HEAD Request
    try {
      newResults.push({
        name: 'Edge Function HEAD',
        status: 'loading',
        message: 'Testing edge function connectivity...'
      })
      setResults([...newResults])

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL not configured')
      }

      const headResponse = await fetch(`${supabaseUrl}/functions/v1/stream-audio`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey || ''
        }
      })

      if (headResponse.ok) {
        newResults[newResults.length - 1] = {
          name: 'Edge Function HEAD',
          status: 'success',
          message: `Status: ${headResponse.status} - Edge function is accessible`,
          details: { status: headResponse.status, headers: Object.fromEntries(headResponse.headers.entries()) }
        }
      } else {
        throw new Error(`HTTP ${headResponse.status} - ${headResponse.statusText}`)
      }
    } catch (error) {
      newResults[newResults.length - 1] = {
        name: 'Edge Function HEAD',
        status: 'error',
        message: `Status: ${error instanceof Error ? error.message : 'Connection failed'}`,
        details: error
      }
    }

    // Test 3: Edge Function GET Request (without trackId - should return info)
    try {
      newResults.push({
        name: 'Edge Function GET',
        status: 'loading',
        message: 'Testing edge function GET endpoint...'
      })
      setResults([...newResults])

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const getResponse = await fetch(`${supabaseUrl}/functions/v1/stream-audio`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey || '',
          'Content-Type': 'application/json'
        }
      })

      if (getResponse.ok) {
        const data = await getResponse.json()
        newResults[newResults.length - 1] = {
          name: 'Edge Function GET',
          status: 'success',
          message: `Status: ${getResponse.status} - ${data.message || 'Success'}`,
          details: data
        }
      } else {
        const errorData = await getResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`HTTP ${getResponse.status} - ${errorData.error || getResponse.statusText}`)
      }
    } catch (error) {
      newResults[newResults.length - 1] = {
        name: 'Edge Function GET',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Request failed'}`,
        details: error
      }
    }

    // Test 4: Sample Track Fetch
    try {
      newResults.push({
        name: 'Sample Track Test',
        status: 'loading',
        message: 'Testing track streaming...'
      })
      setResults([...newResults])

      // Try to get a sample track from database
      const response = await fetch('/api/v1/playlist?goal=focus')
      if (response.ok) {
        const data = await response.json()
        const tracks = data.tracks || []
        if (tracks.length > 0) {
          const sampleTrack = tracks[0]
          
          // Test streaming URL generation
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
          const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
          
          const streamResponse = await fetch(`${supabaseUrl}/functions/v1/stream-audio?trackId=${sampleTrack.id}`, {
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey || ''
            }
          })

          if (streamResponse.ok) {
            const streamData = await streamResponse.json()
            newResults[newResults.length - 1] = {
              name: 'Sample Track Test',
              status: 'success',
              message: `Track "${sampleTrack.title}" streaming URL generated successfully`,
              details: { track: sampleTrack.title, streamUrl: streamData.streamUrl ? 'Generated' : 'Missing' }
            }
          } else {
            throw new Error(`Streaming failed: HTTP ${streamResponse.status}`)
          }
        } else {
          newResults[newResults.length - 1] = {
            name: 'Sample Track Test',
            status: 'warning',
            message: 'No tracks found in database - add some tracks to test streaming',
            details: { tracksFound: 0 }
          }
        }
      } else {
        throw new Error(`Failed to fetch tracks: HTTP ${response.status}`)
      }
    } catch (error) {
      newResults[newResults.length - 1] = {
        name: 'Sample Track Test',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Test failed'}`,
        details: error
      }
    }

    setResults(newResults)
    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'loading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5'
      case 'error':
        return 'border-red-500/20 bg-red-500/5'
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'loading':
        return 'border-blue-500/20 bg-blue-500/5'
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Front-to-Back Audio Test</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Tests
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Click "Run Tests" to check your audio stack
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(result.status)}
                <span className="font-medium text-white">{result.name}</span>
              </div>
              <p className="text-sm text-gray-300 ml-7">{result.message}</p>
              {result.details && (
                <details className="mt-2 ml-7">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AudioTester