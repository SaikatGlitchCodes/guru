"use client"

import { useState, useEffect } from "react"
import { X, Filter, ChevronDown, ChevronUp, MapPin, Clock, BookOpen, User, Zap, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { getRequestFilterOptions } from "@/lib/supabaseAPI"

const FilterSection = ({ title, children, icon: Icon, isOpen: initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  )
}

const CheckboxGroup = ({ options, selectedValues, onChange, placeholder = "No options available" }) => {
  if (!options || options.length === 0) {
    return <p className="text-sm text-gray-500">{placeholder}</p>
  }

  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label
        
        return (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={value}
              checked={selectedValues.includes(value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selectedValues, value])
                } else {
                  onChange(selectedValues.filter(v => v !== value))
                }
              }}
            />
            <Label htmlFor={value} className="text-sm cursor-pointer">
              {label}
            </Label>
          </div>
        )
      })}
    </div>
  )
}

export default function FilterSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearAll 
}) {
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    locations: [],
    requestTypes: [],
    levels: [],
    urgencyLevels: [],
    meetingTypes: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await getRequestFilterOptions()
        if (data && !error) {
          setFilterOptions(data)
        }
      } catch (error) {
        console.error('Error fetching filter options:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchFilterOptions()
    }
  }, [isOpen])

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.subjects?.length > 0) count++
    if (filters.locations?.length > 0) count++
    if (filters.requestTypes?.length > 0) count++
    if (filters.levels?.length > 0) count++
    if (filters.urgencyLevels?.length > 0) count++
    if (filters.meetingTypes?.length > 0) count++
    if (filters.minPrice > 0 || filters.maxPrice < 10000) count++
    return count
  }

  if (!isOpen) return null

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:w-80 lg:shadow-none lg:border-l border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClearAll}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Price Range */}
                <FilterSection title="Price Range" icon={PiggyBank} isOpen={true}>
                  <div className="space-y-4">
                    <div className="px-2">
                      <Slider
                        value={[filters.minPrice, filters.maxPrice]}
                        onValueChange={([min, max]) => {
                          updateFilter('minPrice', min)
                          updateFilter('maxPrice', max)
                        }}
                        max={10000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>${filters.minPrice}</span>
                      <span>${filters.maxPrice}+</span>
                    </div>
                  </div>
                </FilterSection>


                {/* Meeting Types */}
                <FilterSection title="Meeting Types" icon={User} isOpen={true}>
                  <CheckboxGroup
                    options={[
                      { value: 'online', label: 'Online Sessions' },
                      { value: 'offline', label: 'In-Person Sessions' },
                      { value: 'travel', label: 'Tutor Travels to You' }
                    ]}
                    selectedValues={filters.meetingTypes || []}
                    onChange={(values) => updateFilter('meetingTypes', values)}
                  />
                </FilterSection>

                {/* Request Types */}
                <FilterSection title="Request Types" icon={Zap} isOpen={true}>
                  <CheckboxGroup
                    options={filterOptions.requestTypes}
                    selectedValues={filters.requestTypes || []}
                    onChange={(values) => updateFilter('requestTypes', values)}
                    placeholder="Loading request types..."
                  />
                </FilterSection>

                {/* Education Levels */}
                <FilterSection title="Education Levels" icon={BookOpen}>
                  <CheckboxGroup
                    options={filterOptions.levels}
                    selectedValues={filters.levels || []}
                    onChange={(values) => updateFilter('levels', values)}
                    placeholder="Loading education levels..."
                  />
                </FilterSection>

                {/* Urgency */}
                <FilterSection title="Urgency" icon={Clock}>
                  <CheckboxGroup
                    options={filterOptions.urgencyLevels}
                    selectedValues={filters.urgencyLevels || []}
                    onChange={(values) => updateFilter('urgencyLevels', values)}
                    placeholder="Loading urgency levels..."
                  />
                </FilterSection>

                {/* Locations */}
                <FilterSection title="Locations" icon={MapPin}>
                  <CheckboxGroup
                    options={filterOptions.locations}
                    selectedValues={filters.locations || []}
                    onChange={(values) => updateFilter('locations', values)}
                    placeholder="Loading locations..."
                  />
                </FilterSection>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button 
              onClick={onClose} 
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
