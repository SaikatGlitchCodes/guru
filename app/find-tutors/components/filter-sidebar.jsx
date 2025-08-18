"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearAll,
  filterOptions,
  isLoading
}) {
  const handleSubjectChange = (subject, checked) => {
    const currentSubjects = filters.subjects || []
    const newSubjects = checked 
      ? [...currentSubjects, subject]
      : currentSubjects.filter(s => s !== subject)
    
    onFiltersChange({
      ...filters,
      subjects: newSubjects
    })
  }

  const handleLocationChange = (location, checked) => {
    const currentLocations = filters.locations || []
    const newLocations = checked 
      ? [...currentLocations, location]
      : currentLocations.filter(l => l !== location)
    
    onFiltersChange({
      ...filters,
      locations: newLocations
    })
  }

  const handlePriceRangeChange = (newRange) => {
    onFiltersChange({
      ...filters,
      minPrice: newRange[0],
      maxPrice: newRange[1]
    })
  }

  const handleRatingChange = (rating, checked) => {
    onFiltersChange({
      ...filters,
      minRating: checked ? rating : 0
    })
  }

  const handleAvailabilityChange = (status, checked) => {
    onFiltersChange({
      ...filters,
      availabilityStatus: checked ? status : ''
    })
  }

  if (!isOpen) return null

  return (
    <Card className="w-80 sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Locations */}
        <div>
          <label className="text-sm font-medium mb-3 block">Locations</label>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
              ))}
            </div>
          ) : filterOptions?.locations?.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filterOptions.locations.map(location => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    checked={(filters.locations || []).includes(location)}
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
            Hourly Rate: ${filters.minPrice || 0} - ${filters.maxPrice || 100}
          </label>
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 100]}
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
            {[4.8, 4.5, 4.0, 3.5].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked)}
                />
                <div className="flex items-center">
                  <span className="text-sm">{rating}+ stars</span>
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
              <Checkbox
                checked={filters.availabilityStatus === 'available'}
                onCheckedChange={(checked) => handleAvailabilityChange('available', checked)}
              />
              <span className="text-sm">Available now</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.verified === true}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  verified: checked ? true : undefined
                })}
              />
              <span className="text-sm">Verified tutors only</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.instantBooking === true}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  instantBooking: checked ? true : undefined
                })}
              />
              <span className="text-sm">Instant booking</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
