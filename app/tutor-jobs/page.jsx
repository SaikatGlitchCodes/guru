"use client"
import { Suspense, useEffect, useState, useCallback } from "react"
import RequestBrowser from "./components/request-browser"
import FilterSidebar from "./components/filter-sidebar"
import MobileFilterSheet from "./components/mobile-filter-sheet"
import QuickFilters from "./components/quick-filters"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Search, SlidersHorizontal, X } from "lucide-react"
import { getOpenRequests, getRequestFilterOptions } from "@/lib/supabaseAPI"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import ThemedHero from "@/components/ThemedHero"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { useOptimizedRequests } from "@/lib/hooks/useOptimizedRequests"

export default function BrowseRequestsPage() {
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [filterOptions, setFilterOptions] = useState({});
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(true);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    subjects: [],
    locations: [],
    requestTypes: [],
    levels: [],
    urgencyLevels: [],
    meetingTypes: [],
    minPrice: 0,
    maxPrice: 10000
  });

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use optimized requests hook
  const { requests: filteredRequests, stats: requestStats, hasResults } = useOptimizedRequests(
    allRequests,
    filters,
    debouncedSearchQuery,
    sortBy
  );

  // Cache management
  const getCacheKey = useCallback(() => {
    return `requests_${JSON.stringify(filters)}_${debouncedSearchQuery}_${sortBy}`
  }, [filters, debouncedSearchQuery, sortBy]);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = getCacheKey();
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const isExpired = Date.now() - parsed.timestamp > 5 * 60 * 1000; // 5 minutes
        
        if (!isExpired) {
          setAllRequests(parsed.data || []);
          setIsLoading(false);
          return;
        }
      }

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
        limit: 100
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch requests');
      }

      const requestData = result.data || [];
      setAllRequests(requestData);

      // Update cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data: requestData,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again later.');
      
      // Try to load from any available cache
      try {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('requests_'));
        if (keys.length > 0) {
          const latestKey = keys.sort().pop();
          const cached = JSON.parse(localStorage.getItem(latestKey));
          setAllRequests(cached.data || []);
        }
      } catch (cacheError) {
        console.error('Error loading cached data:', cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getCacheKey, debouncedSearchQuery, filters, sortBy]);

  const fetchFilterOptions = useCallback(async () => {
    setIsFilterOptionsLoading(true);
    try {
      // Check cache for filter options
      const cachedOptions = localStorage.getItem('filterOptions');
      if (cachedOptions) {
        const parsed = JSON.parse(cachedOptions);
        const isExpired = Date.now() - parsed.timestamp > 30 * 60 * 1000; // 30 minutes
        
        if (!isExpired) {
          setFilterOptions(parsed.data);
          setIsFilterOptionsLoading(false);
          return;
        }
      }

      const { data, error } = await getRequestFilterOptions();
      if (data && !error) {
        setFilterOptions(data);
        localStorage.setItem('filterOptions', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setIsFilterOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters({
      subjects: [],
      locations: [],
      requestTypes: [],
      levels: [],
      urgencyLevels: [],
      meetingTypes: [],
      minPrice: 0,
      maxPrice: 10000
    });
    setSearchQuery("");
    setActiveQuickFilters([]);
  }, []);

  const handleQuickFilter = useCallback((filterData, filterId) => {
    setFilters(prev => ({
      ...prev,
      ...filterData
    }));
    
    setActiveQuickFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      }
      return [...prev, filterId];
    });
  }, []);

  const handleRefresh = useCallback(() => {
    // Clear cache and refetch
    const keys = Object.keys(localStorage).filter(key => key.startsWith('requests_'));
    keys.forEach(key => localStorage.removeItem(key));
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ThemedHero>
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center text-white mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">
              Tutoring Opportunities
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
              Connect with students who need your expertise
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 animate-slide-up">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by subject, location, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">Highest Price</SelectItem>
                    <SelectItem value="price-low">Lowest Price</SelectItem>
                    <SelectItem value="urgent">Most Urgent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear All Filters Button */}
                <Button
                  variant="outline"
                  onClick={handleClearAllFilters}
                  className="h-12 flex items-center gap-2 border-gray-300 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden md:inline">Clear All</span>
                </Button>
                
                {/* Mobile Filter Button */}
                <div className="md:hidden">
                  <MobileFilterSheet
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearAll={handleClearAllFilters}
                    filterOptions={filterOptions}
                    isLoading={isFilterOptionsLoading}
                  >
                    <Button className="w-full h-12 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </Button>
                  </MobileFilterSheet>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemedHero>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Filters */}
        <QuickFilters
          onFilterSelect={handleQuickFilter}
          activeFilters={activeQuickFilters}
        />
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                            <div className="flex gap-2 mb-4">
                              <div className="h-6 w-20 bg-gray-200 rounded"></div>
                              <div className="h-6 w-16 bg-gray-200 rounded"></div>
                              <div className="h-6 w-24 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              }
            >
              <RequestBrowser
                initialRequests={filteredRequests}
              />
            </Suspense>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              isOpen={true}
              onClose={() => setIsFilterSidebarOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={handleClearAllFilters}
            />
          </div>
        </div>
      </div>
    </div>
  )
}