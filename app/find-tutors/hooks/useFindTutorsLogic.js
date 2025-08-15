"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchTutors, getTutorFiltersData } from '@/lib/supabaseAPI'

export function useFindTutorsLogic() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for tutors and pagination
  const [tutors, setTutors] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    locations: []
  })
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(true)
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating')
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    subjects: searchParams.get('subjects') ? searchParams.get('subjects').split(',') : [],
    locations: searchParams.get('locations') ? searchParams.get('locations').split(',') : [],
    minPrice: parseInt(searchParams.get('minPrice')) || 0,
    maxPrice: parseInt(searchParams.get('maxPrice')) || 100,
    minRating: parseFloat(searchParams.get('minRating')) || 0,
    availabilityStatus: searchParams.get('availability') || '',
    verified: searchParams.get('verified') === 'true' || undefined,
    instantBooking: searchParams.get('instantBooking') === 'true' || undefined
  })
  
  // Quick filters state
  const [activeQuickFilters, setActiveQuickFilters] = useState([])
  
  // Stats
  const [tutorStats, setTutorStats] = useState({
    avgRate: null,
    topRate: null,
    totalTutors: 0
  })

  // Update URL when filters change
  const updateURL = useCallback((newFilters, newSearchQuery, newSortBy, newPage = 1) => {
    const params = new URLSearchParams()
    
    if (newSearchQuery) params.set('q', newSearchQuery)
    if (newFilters.subjects && newFilters.subjects.length > 0) {
      params.set('subjects', newFilters.subjects.join(','))
    }
    if (newFilters.locations && newFilters.locations.length > 0) {
      params.set('locations', newFilters.locations.join(','))
    }
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString())
    if (newFilters.maxPrice < 100) params.set('maxPrice', newFilters.maxPrice.toString())
    if (newFilters.minRating > 0) params.set('minRating', newFilters.minRating.toString())
    if (newFilters.availabilityStatus) params.set('availability', newFilters.availabilityStatus)
    if (newFilters.verified) params.set('verified', 'true')
    if (newFilters.instantBooking) params.set('instantBooking', 'true')
    if (newSortBy && newSortBy !== 'rating') params.set('sort', newSortBy)
    if (newPage > 1) params.set('page', newPage.toString())
    
    const newURL = params.toString() ? `?${params.toString()}` : '/find-tutors'
    router.push(newURL, { scroll: false })
  }, [router])

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    setIsFilterOptionsLoading(true)
    try {
      const result = await getTutorFiltersData()
      if (!result.error && result.data) {
        setFilterOptions({
          subjects: result.data.subjects || [],
          locations: result.data.locations || []
        })
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
    } finally {
      setIsFilterOptionsLoading(false)
    }
  }, [])

  // Load tutors
  const loadTutors = useCallback(async () => {
    setIsLoading(true)
    setIsApplyingFilters(true)
    setError(null)
    
    try {
      const pageFromURL = parseInt(searchParams.get('page')) || 1
      setCurrentPage(pageFromURL)
      
      const result = await searchTutors({
        searchQuery,
        subjects: filters.subjects,
        locations: filters.locations,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        availabilityStatus: filters.availabilityStatus,
        verified: filters.verified,
        instantBooking: filters.instantBooking,
        sortBy,
        page: pageFromURL,
        limit: itemsPerPage
      })
      
      if (!result.error && result.data) {
        setTutors(result.data || [])
        setTotalItems(result.totalCount || 0)
        setTotalPages(result.totalPages || 0)
        
        // Calculate stats
        if (result.data && result.data.length > 0) {
          const rates = result.data.map(t => t.hourly_rate || 0).filter(r => r > 0)
          if (rates.length > 0) {
            const avgRate = Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
            const topRate = Math.max(...rates)
            setTutorStats({
              avgRate,
              topRate,
              totalTutors: result.totalCount || 0
            })
          }
        }
      } else {
        console.error('Error fetching tutors:', result.error)
        setTutors([])
        setError(result.error || 'Failed to load tutors')
      }
    } catch (error) {
      console.error('Error fetching tutors:', error)
      setTutors([])
      setError('Failed to load tutors')
    } finally {
      setIsLoading(false)
      setIsApplyingFilters(false)
    }
  }, [searchParams, searchQuery, filters, sortBy, itemsPerPage])

  // Initialize data loading
  useEffect(() => {
    loadFilterOptions()
  }, [loadFilterOptions])

  useEffect(() => {
    loadTutors()
  }, [loadTutors])

  // Handlers
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
    const timeoutId = setTimeout(() => {
      updateURL(filters, query, sortBy, 1)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters, sortBy, updateURL])

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy)
    updateURL(filters, searchQuery, newSortBy, 1)
  }, [filters, searchQuery, updateURL])

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    updateURL(newFilters, searchQuery, sortBy, 1)
  }, [searchQuery, sortBy, updateURL])

  const handlePageChange = useCallback((page) => {
    updateURL(filters, searchQuery, sortBy, page)
  }, [filters, searchQuery, sortBy, updateURL])

  const handleClearAllFilters = useCallback(() => {
    const clearedFilters = {
      subjects: [],
      locations: [],
      minPrice: 0,
      maxPrice: 100,
      minRating: 0,
      availabilityStatus: '',
      verified: undefined,
      instantBooking: undefined
    }
    setFilters(clearedFilters)
    setSearchQuery('')
    setSortBy('rating')
    setActiveQuickFilters([])
    router.push('/find-tutors')
  }, [router])

  const handleQuickFilter = useCallback((filterData, filterId) => {
    const isActive = activeQuickFilters.includes(filterId)
    
    if (isActive) {
      // Remove quick filter
      setActiveQuickFilters(prev => prev.filter(id => id !== filterId))
      // Reset related filter values
      const clearedFilters = { ...filters }
      Object.keys(filterData).forEach(key => {
        if (key === 'minRating') clearedFilters.minRating = 0
        if (key === 'maxPrice') clearedFilters.maxPrice = 100
        if (key === 'minPrice') clearedFilters.minPrice = 0
        if (key === 'verified') clearedFilters.verified = undefined
        if (key === 'availabilityStatus') clearedFilters.availabilityStatus = ''
      })
      handleFiltersChange(clearedFilters)
    } else {
      // Apply quick filter
      setActiveQuickFilters(prev => [...prev, filterId])
      handleFiltersChange({ ...filters, ...filterData })
    }
  }, [activeQuickFilters, filters, handleFiltersChange])

  const handleRefresh = useCallback(() => {
    loadTutors()
  }, [loadTutors])

  return {
    // State
    tutors,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    error,
    searchQuery,
    sortBy,
    filters,
    filterOptions,
    isFilterOptionsLoading,
    activeQuickFilters,
    isApplyingFilters,
    tutorStats,
    hasResults: tutors.length > 0,
    
    // Handlers
    handlePageChange,
    handleFiltersChange,
    handleSearchChange,
    handleSortChange,
    handleClearAllFilters,
    handleQuickFilter,
    handleRefresh
  }
}
