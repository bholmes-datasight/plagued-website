import { useMemo } from 'react'
import config from '../config/pageConfig.json'

export function usePageConfig() {
  // Filter visible pages
  const visiblePages = useMemo(() => {
    return config.pages.filter((page) => page.visible)
  }, [])

  // Get all pages
  const allPages = useMemo(() => {
    return config.pages
  }, [])

  // Check if a page is accessible
  const isPageAccessible = useMemo(() => {
    return (path) => {
      const page = config.pages.find((p) => p.path === path)
      return page ? true : false
    }
  }, [])

  // Get config for a specific page
  const getPageConfig = useMemo(() => {
    return (path) => {
      return config.pages.find((p) => p.path === path) || null
    }
  }, [])

  return {
    developmentMode: config.developmentMode || false,
    showMailingListPopup: config.showMailingListPopup || false,
    epkConfig: config.epkConfig || {},
    visiblePages,
    allPages,
    isPageAccessible,
    getPageConfig,
  }
}
