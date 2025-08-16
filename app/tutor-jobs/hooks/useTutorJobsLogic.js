import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getOpenRequests, getRequestFilterOptions } from "@/lib/supabaseAPI"
import { useDebounce } from "@/lib/hooks/useDebounce"

export function useTutorJobsLogic() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // State management
  const [requests, setRequests] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || "")
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || "newest")
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true)
  const [filterOptions, setFilterOptions] = useState({})
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(true)
  const [activeQuickFilters, setActiveQuickFilters] = useState([])
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)
  
  const itemsPerPage = 12

  // URL parameters
  const urlFilter = searchParams?.get('filter')
  const isJobSupportMode = urlFilter === 'job-support'

  // Initialize filters from URL parameters
  const getFiltersFromURL = useCallback(() => {
    const params = searchParams || new URLSearchParams()
    
    return {
      subjects: params.get('subjects')?.split(',').filter(Boolean) || [],
      locations: params.get('locations')?.split(',').filter(Boolean) || [],
      requestTypes: params.get('requestTypes')?.split(',').filter(Boolean) || (isJobSupportMode ? ['Job Support'] : []),
      levels: params.get('levels')?.split(',').filter(Boolean) || [],
      urgencyLevels: params.get('urgencyLevels')?.split(',').filter(Boolean) || [],
      meetingTypes: params.get('meetingTypes')?.split(',').filter(Boolean) || [],
      minPrice: parseInt(params.get('minPrice')) || 0,
      maxPrice: parseInt(params.get('maxPrice')) || 10000
    }
  }, [searchParams, isJobSupportMode])

  const [filters, setFilters] = useState(getFiltersFromURL)

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Calculate pagination info
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasResults = requests.length > 0
  const requestStats = {
    total: totalItems,
    displayed: requests.length,
    pages: totalPages,
    currentPage
  }

  // Fetch requests without caching
  const fetchRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch new data
      const result = await getOpenRequests({
        searchQuery: debouncedSearchQuery,
        subjects: filters.subjects,
        locations: filters.locations,
        requestTypes: filters.requestTypes,
        levels: filters.levels,
        urgencyLevels: filters.urgencyLevels,
        meetingTypes: filters.meetingTypes,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy,
        page: currentPage,
        limit: itemsPerPage
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch requests')
      }

      const requestData = result.data || []
      const totalCount = result.totalItems || requestData.length
      
      console.log('Fetched data:', {
        requestDataLength: requestData.length,
        totalCount,
        currentPage,
        itemsPerPage
      })
      
      setRequests(requestData)
      setTotalItems(totalCount)

    } catch (err) {
      console.error('Error fetching requests:', err)
      setError('Failed to load tutoring opportunities. Please check your connection and try again.')
      setRequests([])
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearchQuery, filters, sortBy, currentPage])

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    setIsFilterOptionsLoading(true)
    try {
      const { data, error } = await getRequestFilterOptions()
      if (data && !error) {
        setFilterOptions(data)
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    } finally {
      setIsFilterOptionsLoading(false)
    }
  }, [])

  // URL synchronization
  const updateURL = useCallback((newFilters, newSearchQuery = searchQuery, newSortBy = sortBy) => {
    const params = new URLSearchParams()
    
    // Add filter parameters
    if (newFilters.subjects.length > 0) params.set('subjects', newFilters.subjects.join(','))
    if (newFilters.locations.length > 0) params.set('locations', newFilters.locations.join(','))
    if (newFilters.requestTypes.length > 0) params.set('requestTypes', newFilters.requestTypes.join(','))
    if (newFilters.levels.length > 0) params.set('levels', newFilters.levels.join(','))
    if (newFilters.urgencyLevels.length > 0) params.set('urgencyLevels', newFilters.urgencyLevels.join(','))
    if (newFilters.meetingTypes.length > 0) params.set('meetingTypes', newFilters.meetingTypes.join(','))
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString())
    if (newFilters.maxPrice < 10000) params.set('maxPrice', newFilters.maxPrice.toString())
    
    // Add search query
    if (newSearchQuery.trim()) params.set('search', newSearchQuery.trim())
    
    // Add sort parameter
    if (newSortBy !== 'newest') params.set('sort', newSortBy)
    
    // Special handling for job support mode
    if (newFilters.requestTypes.includes('Job Support')) params.set('filter', 'job-support')
    
    const newURL = params.toString() ? `?${params.toString()}` : ''
    const currentURL = searchParams?.toString() ? `?${searchParams.toString()}` : ''
    
    if (newURL !== currentURL) {
      router.push(`/tutor-jobs${newURL}`, { shallow: true })
    }
  }, [searchParams, router, searchQuery, sortBy])

  // Event handlers
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handleFiltersChange = useCallback((newFilters) => {
    setIsApplyingFilters(true)
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
    updateURL(newFilters)
    setTimeout(() => setIsApplyingFilters(false), 300)
  }, [updateURL])

  const handleSearchChange = useCallback((newSearchQuery) => {
    setSearchQuery(newSearchQuery)
    setCurrentPage(1) // Reset to first page when search changes
    updateURL(filters, newSearchQuery, sortBy)
  }, [filters, sortBy, updateURL])

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(1) // Reset to first page when sort changes
    updateURL(filters, searchQuery, newSortBy)
  }, [filters, searchQuery, updateURL])

  const handleClearAllFilters = useCallback(() => {
    setIsApplyingFilters(true)
    const clearedFilters = {
      subjects: [],
      locations: [],
      requestTypes: [],
      levels: [],
      urgencyLevels: [],
      meetingTypes: [],
      minPrice: 0,
      maxPrice: 10000
    }
    setFilters(clearedFilters)
    setSearchQuery("")
    setSortBy("newest")
    setCurrentPage(1)
    setActiveQuickFilters([])
    router.push('/tutor-jobs', { shallow: true })
    setTimeout(() => setIsApplyingFilters(false), 300)
  }, [router])

  const handleQuickFilter = useCallback((filterData, filterId) => {
    let newFilters = { ...filters }
    const isCurrentlyActive = activeQuickFilters.includes(filterId)
    
    if (isCurrentlyActive) {
      // Remove filter
      Object.keys(filterData).forEach(key => {
        if (key === 'minPrice') {
          newFilters[key] = 0
        } else if (key === 'maxPrice') {
          newFilters[key] = 10000
        } else if (Array.isArray(newFilters[key])) {
          const valuesToRemove = Array.isArray(filterData[key]) ? filterData[key] : [filterData[key]]
          newFilters[key] = newFilters[key].filter(value => !valuesToRemove.includes(value))
        } else {
          newFilters[key] = Array.isArray(filters[key]) ? [] : 0
        }
      })
    } else {
      // Add filter
      Object.keys(filterData).forEach(key => {
        if (Array.isArray(newFilters[key])) {
          const newValues = Array.isArray(filterData[key]) ? filterData[key] : [filterData[key]]
          newFilters[key] = [...new Set([...newFilters[key], ...newValues])]
        } else {
          newFilters[key] = filterData[key]
        }
      })
    }
    
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when quick filters change
    setActiveQuickFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId)
      }
      return [...prev, filterId]
    })
    updateURL(newFilters)
  }, [filters, activeQuickFilters, updateURL])

  const handleRefresh = useCallback(() => {
    fetchRequests()
  }, [fetchRequests])

  // Effects - Essential for data fetching
  useEffect(() => {
    console.log('🎯 useEffect[data fetch]: Triggered by state changes', {
      debouncedSearchQuery,
      filters: JSON.stringify(filters),
      currentPage,
      sortBy
    })
    
    fetchRequests()
  }, [fetchRequests])

  useEffect(() => {
    console.log('🎯 useEffect[filter options]: Triggered')
    fetchFilterOptions()
  }, [fetchFilterOptions])

  // Sync URL parameters with state
  useEffect(() => {
    const urlFilters = getFiltersFromURL()
    setFilters(urlFilters)
    
    // Update active quick filters
    const activeFilters = []
    if (urlFilters.urgencyLevels.includes('High')) activeFilters.push('urgent')
    if (urlFilters.meetingTypes.includes('Online')) activeFilters.push('online')
    if (urlFilters.minPrice >= 50) activeFilters.push('high-pay')
    if (urlFilters.requestTypes.includes('Tutoring')) activeFilters.push('tutoring')
    if (urlFilters.requestTypes.includes('Assignment Help')) activeFilters.push('assignment')
    if (urlFilters.meetingTypes.includes('Offline')) activeFilters.push('local')
    
    setActiveQuickFilters(activeFilters)
  }, [getFiltersFromURL])

  return {
    // State
    requests,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    error,
    searchQuery,
    sortBy,
    isFilterSidebarOpen,
    filterOptions,
    isFilterOptionsLoading,
    activeQuickFilters,
    isApplyingFilters,
    filters,
    requestStats,
    hasResults,
    isJobSupportMode,
    
    // Handlers
    handlePageChange,
    handleFiltersChange,
    handleSearchChange,
    handleSortChange,
    handleClearAllFilters,
    handleQuickFilter,
    handleRefresh,
    setIsFilterSidebarOpen
  }
}
