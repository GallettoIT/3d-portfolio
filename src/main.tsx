import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App'
import './index.css'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="error-boundary">
      <h2>Qualcosa è andato storto:</h2>
      <pre>{error.message}</pre>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)