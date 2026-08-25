import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60 max-w-md mx-auto">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="font-sans font-bold text-stone-900 mb-2">
            Qualcosa è andato storto
          </h3>
          <p className="font-sans text-stone-600 text-sm mb-4">
            Si è verificato un errore durante il caricamento di questa sezione.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-4 py-2 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Ricarica Pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
