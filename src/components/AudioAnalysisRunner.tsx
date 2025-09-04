import React, { useState } from 'react'
import { Play, CheckCircle, XCircle, AlertCircle, RefreshCw, Database, FileAudio, Download } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface AnalysisResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'loading' | 'pending'
  message: string
  details?: any
  progress?: number
}

interface AnalysisSummary {
  total: number
  complete: number
  missing: number
  error: number
  timestamp: string
}

export const AudioAnalysisRunner: React.FC = () => {
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isDryRun, setIsDryRun] = useState(true)
  const [summary, setSummary] = useState<AnalysisSummary | null>(null)

  const runAnalysis = async () => {
    setIsRunning(true)
    setResults([])
    setSummary(null)

    const steps: AnalysisResult[] = [
      {
        name: 'Database Connection Check',
        status: 'pending',
        message: 'Preparing to connect to database...'
      },
      {
        name: 'Track Discovery',
        status: 'pending', 
        message: 'Finding tracks that need analysis...'
      },
      {
        name: 'Audio Analysis',
        status: 'pending',
        message: 'Analyzing audio files for metadata...'
      },
      {
        name: 'Results Processing', 
        status: 'pending',
        message: 'Updating database with results...'
      }
    ]

    setResults([...steps])

    try {
      // Step 1: Database Connection
      steps[0].status = 'loading'
      steps[0].message = 'Testing Supabase connection...'
      setResults([...steps])

      const { count, error: countError } = await supabase
        .from('tracks')
        .select('*', { count: 'exact', head: true })
        .eq('storage_bucket', 'audio')

      if (countError) throw countError

      steps[0].status = 'success'
      steps[0].message = `Connected successfully. Found ${count || 0} tracks total.`
      setResults([...steps])

      // Step 2: Find tracks needing analysis
      steps[1].status = 'loading'
      steps[1].message = 'Checking which tracks need analysis...'
      setResults([...steps])

      // Use a simpler query approach to avoid OR syntax issues - only audio bucket tracks
      const { data: allTracks, error: tracksError } = await supabase
        .from('tracks')
        .select('id, bpm, musical_key_est, analysis_status, storage_bucket')
        .eq('storage_bucket', 'audio')
        .limit(1000)

      if (tracksError) throw tracksError

      // Filter in JavaScript to find tracks needing analysis
      const needsAnalysis = allTracks?.filter(track => 
        !track.bpm || 
        !track.musical_key_est || 
        !track.analysis_status || 
        track.analysis_status !== 'complete'
      ) || []

      const needsAnalysisCount = needsAnalysis.length

      steps[1].status = 'success'
      steps[1].message = `Found ${needsAnalysisCount} tracks needing comprehensive analysis`
      steps[1].details = { 
        needsAnalysis: needsAnalysisCount, 
        total: count || 0,
        missingBPM: needsAnalysis.filter(t => !t.bpm).length,
        missingKey: needsAnalysis.filter(t => !t.musical_key_est).length,
        incompleteAnalysis: needsAnalysis.filter(t => !t.analysis_status || t.analysis_status !== 'complete').length
      }
      setResults([...steps])

      if (!needsAnalysisCount || needsAnalysisCount === 0) {
        steps[2].status = 'success'
        steps[2].message = '✅ All tracks already have complete analysis!'
        steps[3].status = 'success'
        steps[3].message = 'Analysis complete - no changes needed.'
        setResults([...steps])
        return
      }

      if (isDryRun) {
        // Simulate the process for dry run
        steps[2].status = 'loading'
        steps[2].message = `[DRY RUN] Simulating analysis of ${needsAnalysisCount} tracks...`
        setResults([...steps])

        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200))
          steps[2].progress = i
          steps[2].message = `[DRY RUN] Simulating analysis... ${i}%`
          setResults([...steps])
        }

        steps[2].status = 'success'
        steps[2].message = `[DRY RUN] Would analyze ${needsAnalysisCount} tracks with BPM, Camelot keys, and therapeutic metrics`
        setResults([...steps])

        steps[3].status = 'success'
        steps[3].message = 'DRY RUN complete - no database changes made'
        steps[3].details = { 
          total: needsAnalysisCount, 
          complete: needsAnalysisCount, 
          missing: 0, 
          error: 0 
        }
        setResults([...steps])

        setSummary({
          total: needsAnalysisCount,
          complete: needsAnalysisCount,
          missing: 0,
          error: 0,
          timestamp: new Date().toISOString()
        })

      } else {
        // Run the actual analysis
        steps[2].status = 'loading'
        steps[2].message = `Running comprehensive analysis on ${needsAnalysisCount} tracks...`
        setResults([...steps])

        const response = await supabase.functions.invoke('complete-audio-analysis', {
          body: {}
        })

        if (response.error) {
          throw new Error(`Analysis function error: ${response.error.message}`)
        }

        const analysisResult = response.data

        steps[2].status = 'success'
        steps[2].message = `✅ Analyzed ${analysisResult.processed} tracks successfully`
        steps[2].details = analysisResult
        setResults([...steps])

        // Step 4: Final results
        steps[3].status = 'success'
        steps[3].message = analysisResult.errors > 0 
          ? `Analysis complete with ${analysisResult.errors} errors` 
          : 'Analysis completed successfully!'
        steps[3].details = analysisResult
        setResults([...steps])

        setSummary({
          total: analysisResult.total || 0,
          complete: analysisResult.processed || 0,
          missing: 0,
          error: analysisResult.errors || 0,
          timestamp: new Date().toISOString()
        })
      }

    } catch (error) {
      console.error('Analysis error:', error)
      const currentStepIndex = steps.findIndex(step => step.status === 'loading')
      if (currentStepIndex >= 0) {
        steps[currentStepIndex].status = 'error'
        steps[currentStepIndex].message = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        steps[currentStepIndex].details = error
        setResults([...steps])
      }
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'loading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <div className="h-4 w-4 rounded-full border-2 border-gray-600" />
    }
  }

  const getStatusColor = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5'
      case 'error':
        return 'border-red-500/20 bg-red-500/5'
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'loading':
        return 'border-blue-500/20 bg-blue-500/5'
      case 'pending':
        return 'border-gray-500/20 bg-gray-500/5'
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileAudio className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Audio Analysis Pipeline</h3>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isDryRun}
              onChange={(e) => setIsDryRun(e.target.checked)}
              disabled={isRunning}
              className="rounded"
            />
            Dry Run Mode
          </label>
          <button
            onClick={runAnalysis}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-lg transition-colors"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {isDryRun && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <strong>Dry Run Mode:</strong> This will simulate the analysis without making database changes.
          </div>
        </div>
      )}

      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            Click "Start Analysis" to validate audio tracks and run analysis
          </div>
        ) : (
          <>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                  {result.progress && (
                    <div className="ml-auto text-sm text-muted-foreground">
                      {Math.round(result.progress)}%
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground ml-7">{result.message}</p>
                {result.progress && (
                  <div className="ml-7 mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${result.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {result.details && (
                  <details className="mt-2 ml-7">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            {summary && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Analysis Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Processed</div>
                    <div className="text-lg font-bold">{summary.total}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completed</div>
                    <div className="text-lg font-bold text-green-500">{summary.complete}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Missing</div>
                    <div className="text-lg font-bold text-yellow-500">{summary.missing}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Errors</div>
                    <div className="text-lg font-bold text-red-500">{summary.error}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AudioAnalysisRunner