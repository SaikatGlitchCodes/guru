import { useMemo } from 'react'

/**
 * Optimizes requests by memoizing expensive operations
 * @param {Array} requests - The array of requests to optimize
 * @param {Object} filters - Current filter settings
 * @param {String} searchQuery - Search query string
 * @param {String} sortBy - Sort option
 */
export function useOptimizedRequests(requests, filters, searchQuery, sortBy) {
  
  const filteredRequests = useMemo(() => {
    if (!requests || requests.length === 0) return []
    
    let filtered = requests
    
    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(request => {
        const searchableText = [
          request.title,
          request.description,
          request.type,
          request.level,
          request.address?.city,
          request.address?.state,
          request.subjects?.map(s => s.name).join(' ')
        ].filter(Boolean).join(' ').toLowerCase()
        
        return searchableText.includes(query)
      })
    }
    
    // Subject filter
    if (filters.subjects?.length > 0) {
      filtered = filtered.filter(request =>
        request.subjects?.some(subject =>
          filters.subjects.some(filterSubject =>
            subject.name?.toLowerCase().includes(filterSubject.toLowerCase())
          )
        )
      )
    }
    
    // Location filter
    if (filters.locations?.length > 0) {
      filtered = filtered.filter(request => {
        if (!request.address) return false
        const location = `${request.address.city || ''}, ${request.address.state || ''}`
        return filters.locations.some(filterLocation =>
          location.toLowerCase().includes(filterLocation.toLowerCase())
        )
      })
    }
    
    // Type filter
    if (filters.requestTypes?.length > 0) {
      filtered = filtered.filter(request =>
        filters.requestTypes.includes(request.type)
      )
    }
    
    // Level filter
    if (filters.levels?.length > 0) {
      filtered = filtered.filter(request =>
        filters.levels.includes(request.level)
      )
    }
    
    // Urgency filter
    if (filters.urgencyLevels?.length > 0) {
      filtered = filtered.filter(request =>
        filters.urgencyLevels.includes(request.urgency)
      )
    }
    
    // Meeting type filter
    if (filters.meetingTypes?.length > 0) {
      filtered = filtered.filter(request => {
        return filters.meetingTypes.some(type => {
          switch (type) {
            case 'online':
              return request.online_meeting === true
            case 'offline':
              return request.offline_meeting === true
            case 'travel':
              return request.travel_meeting === true
            default:
              return false
          }
        })
      })
    }
    
    // Price filter
    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      filtered = filtered.filter(request => {
        const price = parseFloat(request.price_amount) || 0
        return price >= filters.minPrice && price <= filters.maxPrice
      })
    }
    
    return filtered
  }, [requests, filters, searchQuery])
  
  const sortedRequests = useMemo(() => {
    if (!filteredRequests || filteredRequests.length === 0) return []
    
    const sorted = [...filteredRequests]
    
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'price-high':
          return parseFloat(b.price_amount || 0) - parseFloat(a.price_amount || 0)
        case 'price-low':
          return parseFloat(a.price_amount || 0) - parseFloat(b.price_amount || 0)
        case 'urgent':
          const urgencyOrder = { 
            'urgent': 4, 
            'asap': 4,
            'within a week': 3, 
            'flexible': 1,
            'no rush': 1 
          }
          const urgencyA = urgencyOrder[a.urgency?.toLowerCase()] || 2
          const urgencyB = urgencyOrder[b.urgency?.toLowerCase()] || 2
          
          if (urgencyA !== urgencyB) {
            return urgencyB - urgencyA
          }
          // Secondary sort by created date for same urgency
          return new Date(b.created_at) - new Date(a.created_at)
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0)
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })
    
    return sorted
  }, [filteredRequests, sortBy])
  
  const requestStats = useMemo(() => {
    if (!sortedRequests || sortedRequests.length === 0) {
      return {
        total: 0,
        averagePrice: 0,
        urgentCount: 0,
        onlineCount: 0,
        recentCount: 0
      }
    }
    
    const now = new Date()
    const urgentKeywords = ['urgent', 'asap']
    
    return {
      total: sortedRequests.length,
      averagePrice: Math.round(
        sortedRequests.reduce((sum, req) => sum + (parseFloat(req.price_amount) || 0), 0) / 
        sortedRequests.length
      ),
      urgentCount: sortedRequests.filter(req => 
        urgentKeywords.includes(req.urgency?.toLowerCase())
      ).length,
      onlineCount: sortedRequests.filter(req => req.online_meeting === true).length,
      recentCount: sortedRequests.filter(req => {
        const created = new Date(req.created_at)
        const diffInHours = (now - created) / (1000 * 60 * 60)
        return diffInHours <= 24
      }).length
    }
  }, [sortedRequests])
  
  return {
    requests: sortedRequests,
    stats: requestStats,
    hasResults: sortedRequests.length > 0
  }
}

/**
 * Performance hook for virtualized list rendering
 * @param {Array} items - Items to virtualize
 * @param {Number} itemHeight - Height of each item
 * @param {Number} containerHeight - Height of container
 */
export function useVirtualizedList(items, itemHeight = 200, containerHeight = 800) {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 // Buffer
    const totalHeight = items.length * itemHeight
    
    return {
      totalHeight,
      visibleCount,
      getVisibleItems: (scrollTop) => {
        const startIndex = Math.floor(scrollTop / itemHeight)
        const endIndex = Math.min(startIndex + visibleCount, items.length)
        
        return {
          startIndex,
          endIndex,
          items: items.slice(startIndex, endIndex),
          offsetY: startIndex * itemHeight
        }
      }
    }
  }, [items, itemHeight, containerHeight])
}
