import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logger } from '@/services/logger'

interface Props {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = Math.random().toString(36).substr(2, 9)
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      errorId: this.state.errorId,
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props

      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.retry} />
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-8 max-w-md w-full text-center border border-destructive/20">
            <AlertTriangle className="mx-auto mb-4 text-destructive" size={48} />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.retry}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground mt-4">
                Error ID: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Simple error fallback component
export const SimpleErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ 
  error, 
  retry 
}) => (
  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
    <div className="flex items-center gap-2 text-destructive mb-2">
      <AlertTriangle size={20} />
      <span className="font-medium">Error</span>
    </div>
    <p className="text-destructive/80 text-sm mb-3">{error.message}</p>
    <button
      onClick={retry}
      className="text-destructive underline hover:no-underline text-sm"
    >
      Try again
    </button>
  </div>
)