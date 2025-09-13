import Button from '@/components/ui/Button';
import { Props, State } from '@/types';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, ErrorInfo } from 'react';

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
            <div className='flex justify-center mb-4'>
              <AlertTriangle className='w-16 h-16 text-red-500' />
            </div>

            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Something went wrong
            </h2>

            <p className='text-gray-600 mb-6'>
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-left'>
                <p className='text-sm text-red-800 font-mono'>
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className='space-y-3'>
              <Button onClick={this.handleRetry} className='w-full'>
                <RefreshCw className='w-4 h-4 mr-2' />
                Try Again
              </Button>

              <Button
                variant='secondary'
                onClick={() => window.location.reload()}
                className='w-full'
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
