import { Navigate } from 'react-router-dom'
import { usePageConfig } from '../hooks/usePageConfig'

/**
 * RouteGuard - Protects routes that should only be accessible when not in development mode
 * Redirects to home if accessed during development mode
 */
export function RouteGuard({ children, allowInDevelopment = false }) {
  const { developmentMode } = usePageConfig()

  // If we're in development mode and this route isn't allowed, redirect to home
  if (developmentMode && !allowInDevelopment) {
    return <Navigate to="/" replace />
  }

  // Otherwise, render the children
  return children
}
