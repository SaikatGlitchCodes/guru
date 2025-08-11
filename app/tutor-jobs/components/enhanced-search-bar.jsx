import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  X, 
  Briefcase, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Star, 
  BookOpen, 
  MapPin,
  SlidersHorizontal
} from "lucide-react"
import MobileFilterSheet from "./mobile-filter-sheet"

export default function EnhancedSearchBar({
  searchQuery,
  sortBy,
  isJobSupportMode,
  isApplyingFilters,
  requestStats,
  filters,
  activeQuickFilters,
  filterOptions,
  isFilterOptionsLoading,
  filteredRequests,
  onSearchChange,
  onSortChange,
  onJobSupportToggle,
  onClearAllFilters,
  onFiltersChange,
  router
}) {
  const hasActiveFilters = searchQuery || activeQuickFilters.length > 0 || Object.values(filters).some(val => 
    Array.isArray(val) ? val.length > 0 : (val > 0 && val < 10000)
  )

  const isClearButtonDisabled = !searchQuery && activeQuickFilters.length === 0 && Object.values(filters).every(val => 
    Array.isArray(val) ? val.length === 0 : val === 0 || val === 10000
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slide-up overflow-hidden">
        {/* Search Stats Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-600">
              {isApplyingFilters && (
                <span className="flex items-center gap-2 text-blue-600">
                  <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                  Updating...
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {requestStats?.avgPrice && (
                <span>Avg: ${requestStats.avgPrice}/hr</span>
              )}
              {requestStats?.highestPrice && (
                <span>Max: ${requestStats.highestPrice}/hr</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Search Controls */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Opportunities
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder={isJobSupportMode 
                    ? "e.g., React, Java, Interview prep, System design..." 
                    : "e.g., Mathematics, Physics, Programming, Spanish..."
                  }
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Latest
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Oldest
                    </div>
                  </SelectItem>
                  <SelectItem value="price-high">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Highest Pay
                    </div>
                  </SelectItem>
                  <SelectItem value="price-low">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Lowest Pay
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Most Urgent
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Popular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Support Toggle */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode
              </label>
              <Button
                variant={isJobSupportMode ? "default" : "outline"}
                onClick={onJobSupportToggle}
                className={`h-12 w-full flex items-center gap-2 transition-all duration-200 ${
                  isJobSupportMode 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Job Support</span>
                <span className="sm:hidden">Career</span>
              </Button>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actions
              </label>
              <Button
                variant="outline"
                onClick={onClearAllFilters}
                disabled={isClearButtonDisabled}
                className="h-12 w-full flex items-center gap-2 border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <div className="md:col-span-1 md:hidden">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filters
              </label>
              <MobileFilterSheet
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClearAll={onClearAllFilters}
                filterOptions={filterOptions}
                isLoading={isFilterOptionsLoading}
              >
                <Button className="w-full h-12 flex items-center gap-2 bg-gray-600 hover:bg-gray-700">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
              </MobileFilterSheet>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200">
                    <Search className="w-3 h-3" />
                    "{searchQuery}"
                    <button
                      onClick={() => onSearchChange('')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                
                {filters.subjects.map(subject => (
                  <Badge key={`subject-${subject}`} variant="outline" className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {subject}
                    <button
                      onClick={() => onFiltersChange({
                        ...filters,
                        subjects: filters.subjects.filter(s => s !== subject)
                      })}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {filters.locations.map(location => (
                  <Badge key={`location-${location}`} variant="outline" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {location}
                    <button
                      onClick={() => onFiltersChange({
                        ...filters,
                        locations: filters.locations.filter(l => l !== location)
                      })}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${filters.minPrice} - ${filters.maxPrice}/hr
                    <button
                      onClick={() => onFiltersChange({
                        ...filters,
                        minPrice: 0,
                        maxPrice: 10000
                      })}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
