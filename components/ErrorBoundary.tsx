import * as React from 'react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare state and props properties to satisfy TypeScript in environments where inheritance detection might be limited
  public state: ErrorBoundaryState = { hasError: false };
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Explicitly assign props to this.props to ensure availability in the instance
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Accessing state safely after explicit declaration
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-zinc-800 mb-2">Something went wrong.</h1>
            <p className="text-zinc-600 mb-6">We're sorry, but an unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-full transition-colors"
            >
              Refresh Page
            </button>
            {/* Safely access error property for diagnostic info after explicit state declaration */}
            {this.state.error && (
                <details className="mt-6 text-left text-xs text-zinc-400 overflow-hidden">
                    <summary className="cursor-pointer mb-1 hover:text-zinc-500">Error Details</summary>
                    <pre className="bg-zinc-100 p-2 rounded overflow-auto max-h-32">
                        {this.state.error.toString()}
                    </pre>
                </details>
            )}
          </div>
        </div>
      );
    }

    // Accessing props correctly after explicit declaration to fix "Property 'props' does not exist" error
    return this.props.children || null;
  }
}

export default ErrorBoundary;