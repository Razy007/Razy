import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import './i18n'; // Force i18n init before render

// 🔥 GLOBAL ERROR CATCHER - Catch errors even before React starts
window.onerror = (msg, src, line, col, err) => {
  console.error('🚨 GLOBAL CRASH BEFORE REACT:', msg, err);
  console.error('Location:', src, 'Line:', line, 'Col:', col);
  console.error('Stack:', err?.stack);
  return false; // Let ErrorBoundary also handle it
};

// 🔍 DEBUG: Check critical globals
console.log('🚀 Main.tsx starting... PROD v2.3.5 - Progressive Auth Active');
console.log('🔍 Pi SDK Type:', typeof window.Pi, window.Pi);
console.log('🔍 URL:', typeof URL);
console.log('🔍 Image:', typeof Image);

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'white', background: '#333' }}>
          <h1>⚠️ Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

// Disable StrictMode in production to avoid double-initialization issues
const app = (
  <ErrorBoundary>
    <Suspense fallback={<div className="text-white p-4">Loading App & Translations...</div>}>
      <HashRouter>
        {/* All routing now handled inside App component */}
        <App />
      </HashRouter>
    </Suspense>
  </ErrorBoundary>
);

if (import.meta.env.DEV) {
  // Development: Use StrictMode for better debugging
  root.render(<React.StrictMode>{app}</React.StrictMode>);
} else {
  // Production: No StrictMode to avoid issues
  root.render(app);
}
