/**
 * Formatting utilities for display
 */
import { format, formatDistanceToNow } from 'date-fns'

/**
 * Format price in pence to GBP
 */
export function formatPrice(pence) {
  return `£${(pence / 100).toFixed(2)}`
}

/**
 * Format date string
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return format(date, 'dd MMM yyyy, HH:mm')
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true })
}

/**
 * Format date as short date (e.g., "13 Jan 2024")
 */
export function formatShortDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return format(date, 'dd MMM yyyy')
}

/**
 * Get status color
 */
export function getStatusColor(status) {
  const colors = {
    paid: 'status-paid',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
    refunded: 'status-refunded',
  }
  return colors[status] || 'plague-mist'
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
