"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, MapPin, Clock, BookOpen, Award, Users, ChevronLeft, ChevronRight, X } from "lucide-react"
import { searchTutors, getTutorFiltersData, startConversation } from '@/lib/supabaseAPI'
import { useUser } from "@/contexts/UserContext"

export default function FindTutorsPage() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for tutors and pagination
  const [tutors, setTutors] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingFilters, setLoadingFilters] = useState(true)
  
  // Filter options
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [availableLocations, setAvailableLocations] = useState([])
  
  // Filter state - initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedSubjects, setSelectedSubjects] = useState(
    searchParams.get('subjects') ? searchParams.get('subjects').split(',') : []
  )
  const [selectedLocations, setSelectedLocations] = useState(
    searchParams.get('locations') ? searchParams.get('locations').split(',') : []
  )
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || 0,
    parseInt(searchParams.get('maxPrice')) || 100
  ])
  const [minRating, setMinRating] = useState(parseFloat(searchParams.get('minRating')) || 0)
  const [availabilityFilter, setAvailabilityFilter] = useState(searchParams.get('availability') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating')

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams()
    
    if (newFilters.q) params.set('q', newFilters.q)
    if (newFilters.subjects && newFilters.subjects.length > 0) {
      params.set('subjects', newFilters.subjects.join(','))
    }
    if (newFilters.locations && newFilters.locations.length > 0) {
      params.set('locations', newFilters.locations.join(','))
    }
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString())
    if (newFilters.maxPrice < 100) params.set('maxPrice', newFilters.maxPrice.toString())
    if (newFilters.minRating > 0) params.set('minRating', newFilters.minRating.toString())
    if (newFilters.availability && newFilters.availability !== 'all') {
      params.set('availability', newFilters.availability)
    }
    if (newFilters.sort && newFilters.sort !== 'rating') params.set('sort', newFilters.sort)
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString())
    
    const newURL = params.toString() ? `?${params.toString()}` : '/find-tutors'
    router.push(newURL, { scroll: false })
  }

  // Load filter options
  useEffect(() => {
    const loadFiltersData = async () => {
      setLoadingFilters(true)
      try {
        const result = await getTutorFiltersData()
        if (!result.error) {
          setAvailableSubjects(result.subjects || [])
          setAvailableLocations(result.locations || [])
        }
      } catch (error) {
        console.error('Error loading filter data:', error)
      } finally {
        setLoadingFilters(false)
      }
    }
    loadFiltersData()
  }, [])

  // Load tutors when filters change
  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true)
      try {
        const pageFromURL = parseInt(searchParams.get('page')) || 1
        setCurrentPage(pageFromURL)
        
        const result = await searchTutors({
          searchQuery,
          subjects: selectedSubjects,
          locations: selectedLocations,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          availabilityStatus: availabilityFilter,
          sortBy,
          page: pageFromURL,
          limit: 8
        })
        
        if (!result.error) {
          setTutors(result.data || [])
          setTotalCount(result.totalCount || 0)
          setTotalPages(result.totalPages || 0)
          setHasMore(result.hasMore || false)
        } else {
          console.error('Error fetching tutors:', result.error)
          setTutors([])
        }
      } catch (error) {
        console.error('Error fetching tutors:', error)
        setTutors([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchTutors()
  }, [searchParams]) // Re-run when URL params change

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (searchParams.get('q') || '')) {
        updateFiltersAndSearch()
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Update filters and trigger new search
  const updateFiltersAndSearch = () => {
    const newFilters = {
      q: searchQuery,
      subjects: selectedSubjects,
      locations: selectedLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      availability: availabilityFilter,
      sort: sortBy,
      page: 1 // Reset to first page when filters change
    }
    updateURL(newFilters)
  }

  // Handle filter changes
  const handleSubjectChange = (subject, checked) => {
    const newSubjects = checked 
      ? [...selectedSubjects, subject]
      : selectedSubjects.filter(s => s !== subject)
    setSelectedSubjects(newSubjects)
    
    // Update immediately for checkboxes
    updateURL({
      q: searchQuery,
      subjects: newSubjects,
      locations: selectedLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      availability: availabilityFilter,
      sort: sortBy,
      page: 1
    })
  }

  const handleLocationChange = (location, checked) => {
    const newLocations = checked 
      ? [...selectedLocations, location]
      : selectedLocations.filter(l => l !== location)
    setSelectedLocations(newLocations)
    
    // Update immediately for checkboxes
    updateURL({
      q: searchQuery,
      subjects: selectedSubjects,
      locations: newLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      availability: availabilityFilter,
      sort: sortBy,
      page: 1
    })
  }

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange)
    // Debounced update for slider
    setTimeout(() => {
      updateURL({
        q: searchQuery,
        subjects: selectedSubjects,
        locations: selectedLocations,
        minPrice: newRange[0],
        maxPrice: newRange[1],
        minRating,
        availability: availabilityFilter,
        sort: sortBy,
        page: 1
      })
    }, 500)
  }

  const handleRatingChange = (rating) => {
    const newRating = minRating === rating ? 0 : rating
    setMinRating(newRating)
    updateURL({
      q: searchQuery,
      subjects: selectedSubjects,
      locations: selectedLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: newRating,
      availability: availabilityFilter,
      sort: sortBy,
      page: 1
    })
  }

  const handleAvailabilityChange = (value) => {
    setAvailabilityFilter(value)
    updateURL({
      q: searchQuery,
      subjects: selectedSubjects,
      locations: selectedLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      availability: value,
      sort: sortBy,
      page: 1
    })
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    updateURL({
      q: searchQuery,
      subjects: selectedSubjects,
      locations: selectedLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      availability: availabilityFilter,
      sort: value,
      page: 1
    })
  }

  // Pagination handlers
  const handlePageChange = (page) => {
    updateURL({
      q: searchQuery,
      subjects: selectedSubjects,
      locations: selectedLocations,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      availability: availabilityFilter,
      sort: sortBy,
      page
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSubjects([])
    setSelectedLocations([])
    setPriceRange([0, 100])
    setMinRating(0)
    setAvailabilityFilter('all')
    setSortBy('rating')
    router.push('/find-tutors')
  }

  // Remove individual filter
  const removeFilter = (type, value) => {
    switch (type) {
      case 'search':
        setSearchQuery('')
        updateURL({
          q: '',
          subjects: selectedSubjects,
          locations: selectedLocations,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          availability: availabilityFilter,
          sort: sortBy,
          page: 1
        })
        break
      case 'subject':
        const newSubjects = selectedSubjects.filter(s => s !== value)
        setSelectedSubjects(newSubjects)
        updateURL({
          q: searchQuery,
          subjects: newSubjects,
          locations: selectedLocations,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          availability: availabilityFilter,
          sort: sortBy,
          page: 1
        })
        break
      case 'location':
        const newLocations = selectedLocations.filter(l => l !== value)
        setSelectedLocations(newLocations)
        updateURL({
          q: searchQuery,
          subjects: selectedSubjects,
          locations: newLocations,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          availability: availabilityFilter,
          sort: sortBy,
          page: 1
        })
        break
      case 'price':
        setPriceRange([0, 100])
        updateURL({
          q: searchQuery,
          subjects: selectedSubjects,
          locations: selectedLocations,
          minPrice: 0,
          maxPrice: 100,
          minRating,
          availability: availabilityFilter,
          sort: sortBy,
          page: 1
        })
        break
      case 'rating':
        setMinRating(0)
        updateURL({
          q: searchQuery,
          subjects: selectedSubjects,
          locations: selectedLocations,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating: 0,
          availability: availabilityFilter,
          sort: sortBy,
          page: 1
        })
        break
      case 'availability':
        setAvailabilityFilter('all')
        updateURL({
          q: searchQuery,
          subjects: selectedSubjects,
          locations: selectedLocations,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          availability: 'all',
          sort: sortBy,
          page: 1
        })
        break
    }
  }

  // Get active filters for display
  const getActiveFilters = () => {
    const filters = []
    
    if (searchQuery) {
      filters.push({ type: 'search', value: searchQuery, label: `Search: "${searchQuery}"` })
    }
    
    selectedSubjects.forEach(subject => {
      filters.push({ type: 'subject', value: subject, label: `Subject: ${subject}` })
    })
    
    selectedLocations.forEach(location => {
      filters.push({ type: 'location', value: location, label: `Location: ${location}` })
    })
    
    if (priceRange[0] > 0 || priceRange[1] < 100) {
      filters.push({ 
        type: 'price', 
        value: `${priceRange[0]}-${priceRange[1]}`, 
        label: `Price: $${priceRange[0]} - $${priceRange[1]}` 
      })
    }
    
    if (minRating > 0) {
      filters.push({ type: 'rating', value: minRating, label: `Rating: ${minRating}+ stars` })
    }
    
    if (availabilityFilter !== 'all') {
      const availabilityLabels = {
        'available': 'Available Now',
        'available today': 'Available Today',
        'available this week': 'Available This Week'
      }
      filters.push({ 
        type: 'availability', 
        value: availabilityFilter, 
        label: availabilityLabels[availabilityFilter] || availabilityFilter
      })
    }
    
    return filters
  }

  // Active Filters Component
  const ActiveFilters = () => {
    const activeFilters = getActiveFilters()
    
    if (activeFilters.length === 0) return null
    
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Active Filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge 
                key={`${filter.type}-${filter.value}-${index}`}
                variant="secondary" 
                className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="ml-2 hover:text-blue-900"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {activeFilters.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-900 ml-2"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleContactTutor = async (tutor) => {
    if (!user?.id) {
      alert("Please sign in to contact tutors")
      return
    }
    
    if (!tutor.user_id && !tutor.id) {
      alert("Unable to contact this tutor. Please try again later.")
      return
    }

    try {
      const tutorId = tutor.user_id || tutor.id
      
      const result = await startConversation(
        user.id, 
        tutorId, 
        null,
        `Hi ${tutor.name}, I'm interested in your tutoring services. I'd love to discuss my learning needs with you. Are you available for a consultation?`
      )
      
      if (result.error) {
        console.error('Error starting conversation:', result.error)
        alert('Failed to start conversation. Please try again.')
        return
      }
      
      window.location.href = `/messages/${tutorId}`
    } catch (error) {
      console.error('Error contacting tutor:', error)
      alert('Failed to contact tutor. Please try again.')
    }
  }

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const showPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              className="px-3 py-1"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map(page => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
            className="px-3 py-1"
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (loading && tutors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading tutors...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black py-10 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b black black z-10"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(white 1px, transparent 1px),
                linear-gradient(90deg, white 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}
          ></div>
        </div>

        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
        `}</style>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center text-white mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">
              Find Your Perfect Tutor
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
              Connect with expert tutors for personalized learning
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 animate-slide-up">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by subject, tutor name, or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
                <Select value={availabilityFilter} onValueChange={handleAvailabilityChange}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="available">Available Now</SelectItem>
                    <SelectItem value="available today">Available Today</SelectItem>
                    <SelectItem value="available this week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Filters */}
      <ActiveFilters />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Subjects */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Subjects</label>
                    {loadingFilters ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          </div>
                        ))}
                      </div>
                    ) : availableSubjects.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableSubjects.map(subject => (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedSubjects.includes(subject)}
                              onCheckedChange={(checked) => handleSubjectChange(subject, checked)}
                            />
                            <span className="text-sm">{subject}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No subjects available</p>
                    )}
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Locations</label>
                    {loadingFilters ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                          </div>
                        ))}
                      </div>
                    ) : availableLocations.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableLocations.map(location => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedLocations.includes(location)}
                              onCheckedChange={(checked) => handleLocationChange(location, checked)}
                            />
                            <span className="text-sm">{location}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No locations available</p>
                    )}
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            checked={minRating === rating}
                            onCheckedChange={() => handleRatingChange(rating)}
                          />
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{rating}+ ({tutors.filter(t => t.rating >= rating).length})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Availability</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Available now</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Available today</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Available this week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutors List */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {totalCount > 0 ? `${totalCount} Tutors Found` : `${tutors.length} Tutors Found`}
                </h2>
                <p className="text-gray-600">
                  {currentPage > 1 && `Page ${currentPage} of ${totalPages} • `}
                  Find the perfect tutor for your learning needs
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tutors Grid */}
            <div className="grid gap-6">
              {tutors.map(tutor => (
                <Card key={tutor.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tutor Avatar and Basic Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={tutor.avatar_url} alt={tutor.name} />
                          <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{tutor.name}</h3>
                            {tutor.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                <Award className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{tutor.rating}</span>
                              <span>({tutor.total_reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{tutor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{tutor.response_time}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {tutor.subjects && tutor.subjects.map(subject => (
                              <Badge key={subject.id || subject.name} variant="outline">{subject.name}</Badge>
                            ))}
                          </div>

                          <p className="text-gray-600 text-sm mb-4">{tutor.bio}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{tutor.experience_years} years exp.</span>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">
                                {tutor.availability_status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${tutor.hourly_rate}
                                <span className="text-sm font-normal text-gray-600">/hour</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t">
                      <Button 
                        className="flex-1"
                        onClick={() => handleContactTutor(tutor)}
                      >
                        Contact Tutor
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => router.push(`/tutor-profile/${tutor.user_id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Pagination />

            {tutors.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tutors found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more tutors.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                  <span className="text-gray-400">or</span>
                  <Button 
                    onClick={() => router.push('/request-tutor')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create a Tutor Request
                  </Button>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>Can't find what you're looking for?</strong><br />
                    Create a request and let qualified tutors come to you! Describe what you need help with, and tutors will apply to work with you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}