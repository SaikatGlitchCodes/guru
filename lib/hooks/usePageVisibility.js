import { useState, useEffect } from 'react'

/**
 * Hook to track page visibility and prevent unnecessary re-renders on tab switch
 * This helps prevent loading states when switching tabs
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  const [wasHidden, setWasHidden] = useState(false)

  useEffect(() => {
    function handleVisibilityChange() {
      const currentlyVisible = !document.hidden
      setIsVisible(currentlyVisible)
      
      if (!currentlyVisible) {
        setWasHidden(true)
      }
    }

    // Set initial state
    setIsVisible(!document.hidden)

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also listen for focus/blur events for better coverage
    window.addEventListener('focus', () => setIsVisible(true))
    window.addEventListener('blur', () => setIsVisible(false))

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', () => setIsVisible(true))
      window.removeEventListener('blur', () => setIsVisible(false))
    }
  }, [])

  // Reset wasHidden when page becomes visible again
  useEffect(() => {
    if (isVisible && wasHidden) {
      setWasHidden(false)
    }
  }, [isVisible, wasHidden])

  return {
    isVisible,
    wasHidden,
    justBecameVisible: isVisible && wasHidden
  }
}

/**
 * Hook to manage stable data fetching that doesn't re-trigger on tab switch
 * Use this for expensive operations that don't need to re-run when page becomes visible
 */
export function useStableData(fetchFn, dependencies = [], options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { preventRefreshOnReturn = true } = options
  const { isVisible, justBecameVisible } = usePageVisibility()

  useEffect(() => {
    // If we're preventing refresh on return and page just became visible, skip
    if (preventRefreshOnReturn && justBecameVisible && data !== null) {
      return
    }

    let isCancelled = false
    
    const fetchData = async () => {
      if (!isCancelled) {
        setLoading(true)
        setError(null)
      }
      
      try {
        const result = await fetchFn()
        if (!isCancelled) {
          setData(result)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: () => fetchFn() }
}
