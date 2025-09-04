import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  X, 
  Star, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  Award, 
  BookOpen, 
  MapPin,
  SlidersHorizontal,
} from "lucide-react"

export default function EnhancedSearchBar({
  searchQuery,
  sortBy,
  isApplyingFilters,
  tutorStats,
  filters,
  activeQuickFilters,
  onSearchChange,
  onSortChange,
  onClearAllFilters,
  onFiltersChange
}) {
  const hasActiveFilters = searchQuery || activeQuickFilters.length > 0 || Object.values(filters).some(val => 
    Array.isArray(val) ? val.length > 0 : (val !== null && val !== undefined && val !== '')
  )

  const isClearButtonDisabled = !searchQuery && activeQuickFilters.length === 0 && Object.values(filters).every(val => 
    Array.isArray(val) ? val.length === 0 : val === null || val === undefined || val === ''
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slide-up overflow-hidden">

        {/* Main Search Controls */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tutors
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search by subject, tutor name, or expertise..."
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
            <div className="md:col-span-3 hidden md:block">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Highest Rated
                    </div>
                  </SelectItem>
                  <SelectItem value="price-low">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Price: Low to High
                    </div>
                  </SelectItem>
                  <SelectItem value="price-high">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Price: High to Low
                    </div>
                  </SelectItem>
                  <SelectItem value="experience">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Most Experienced
                    </div>
                  </SelectItem>
                  <SelectItem value="reviews">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Most Reviews
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-3 hidden md:block">
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
              <Button className="w-full h-12 flex items-center gap-2 bg-gray-600 hover:bg-gray-700">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>
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
                
                {filters.subjects?.map(subject => (
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

                {filters.locations?.map(location => (
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

                {(filters.minPrice > 0 || filters.maxPrice < 100) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    ${filters.minPrice} - ${filters.maxPrice}/hr
                    <button
                      onClick={() => onFiltersChange({
                        ...filters,
                        minPrice: 0,
                        maxPrice: 100
                      })}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {filters.minRating > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {filters.minRating}+ stars
                    <button
                      onClick={() => onFiltersChange({
                        ...filters,
                        minRating: 0
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
