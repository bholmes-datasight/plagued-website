import { useState, useEffect, useMemo } from 'react'

// Default fallback config if fetch fails
const defaultConfig = {
  pages: [
    { path: '/', label: 'Home', visible: true, description: 'EPK Landing Page' },
    { path: '/about', label: 'About', visible: true, description: 'Band Biography' },
    { path: '/music', label: 'Music', visible: true, description: 'Discography & Streaming' },
    { path: '/merch', label: 'Merch', visible: true, description: 'Merchandise Store' },
    { path: '/shows', label: 'Shows', visible: true, description: 'Tour Dates' },
    { path: '/contact', label: 'Contact', visible: true, description: 'Contact & Booking' },
  ],
}

export function usePageConfig() {
  const [config, setConfig] = useState(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/src/config/pageConfig.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load config')
        return response.json()
      })
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((error) => {
        console.warn('Failed to load page config, using defaults:', error)
        setConfig(defaultConfig)
        setLoading(false)
      })
  }, [])

  // Filter visible pages
  const visiblePages = useMemo(() => {
    return config.pages.filter((page) => page.visible)
  }, [config])

  // Get all pages
  const allPages = useMemo(() => {
    return config.pages
  }, [config])

  // Check if a page is accessible
  const isPageAccessible = useMemo(() => {
    return (path) => {
      const page = config.pages.find((p) => p.path === path)
      return page ? true : false
    }
  }, [config])

  // Get config for a specific page
  const getPageConfig = useMemo(() => {
    return (path) => {
      return config.pages.find((p) => p.path === path) || null
    }
  }, [config])

  return {
    visiblePages,
    allPages,
    isPageAccessible,
    getPageConfig,
    loading,
  }
}
