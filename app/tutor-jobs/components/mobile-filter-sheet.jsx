"use client"

import { useState } from "react"
import { Filter, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const FilterTab = ({ title, children, count = 0 }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {count > 0 && (
          <Badge variant="secondary">{count}</Badge>
        )}
      </div>
      {children}
    </div>
  )
}

const CheckboxList = ({ options, selectedValues, onChange, placeholder = "No options available" }) => {
  if (!options || options.length === 0) {
    return <p className="text-sm text-gray-500 py-4">{placeholder}</p>
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label
        const isSelected = selectedValues.includes(value)
        
        return (
          <div 
            key={value} 
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              if (isSelected) {
                onChange(selectedValues.filter(v => v !== value))
              } else {
                onChange([...selectedValues, value])
              }
            }}
          >
            <Label className="cursor-pointer flex-1">{label}</Label>
            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
          </div>
        )
      })}
    </div>
  )
}

export default function MobileFilterSheet({ 
  children, 
  filters, 
  onFiltersChange, 
  onClearAll,
  filterOptions = {},
  isLoading = false
}) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const updateLocalFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    setOpen(false)
  }

  const handleClear = () => {
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
    setLocalFilters(clearedFilters)
    onClearAll()
    setOpen(false)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.subjects?.length > 0) count += localFilters.subjects.length
    if (localFilters.locations?.length > 0) count += localFilters.locations.length
    if (localFilters.requestTypes?.length > 0) count += localFilters.requestTypes.length
    if (localFilters.levels?.length > 0) count += localFilters.levels.length
    if (localFilters.urgencyLevels?.length > 0) count += localFilters.urgencyLevels.length
    if (localFilters.meetingTypes?.length > 0) count += localFilters.meetingTypes.length
    if (localFilters.minPrice > 0 || localFilters.maxPrice < 10000) count++
    return count
  }

  // Reset local filters when external filters change
  useState(() => {
    setLocalFilters(filters)
  }, [filters])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </SheetTitle>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 -mx-6 px-6">
            <Tabs defaultValue="price" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="meeting">Meeting</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>
              </TabsList>

              <TabsContent value="price" className="mt-0">
                <FilterTab title="Price Range" count={localFilters.minPrice > 0 || localFilters.maxPrice < 10000 ? 1 : 0}>
                  <div className="space-y-6">
                    <div className="px-2">
                      <Slider
                        value={[localFilters.minPrice, localFilters.maxPrice]}
                        onValueChange={([min, max]) => {
                          updateLocalFilter('minPrice', min)
                          updateLocalFilter('maxPrice', max)
                        }}
                        max={10000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-lg font-medium">
                      <span>${localFilters.minPrice}</span>
                      <span>${localFilters.maxPrice}+</span>
                    </div>
                  </div>
                </FilterTab>
              </TabsContent>

              <TabsContent value="subjects" className="mt-0">
                <FilterTab title="Subjects" count={localFilters.subjects?.length || 0}>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <CheckboxList
                      options={filterOptions.subjects}
                      selectedValues={localFilters.subjects || []}
                      onChange={(values) => updateLocalFilter('subjects', values)}
                      placeholder="Loading subjects..."
                    />
                  )}
                </FilterTab>
              </TabsContent>

              <TabsContent value="meeting" className="mt-0">
                <div className="space-y-6">
                  <FilterTab title="Meeting Types" count={localFilters.meetingTypes?.length || 0}>
                    <CheckboxList
                      options={[
                        { value: 'online', label: 'Online Sessions' },
                        { value: 'offline', label: 'In-Person Sessions' },
                        { value: 'travel', label: 'Tutor Travels to You' }
                      ]}
                      selectedValues={localFilters.meetingTypes || []}
                      onChange={(values) => updateLocalFilter('meetingTypes', values)}
                    />
                  </FilterTab>

                  <FilterTab title="Request Types" count={localFilters.requestTypes?.length || 0}>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <CheckboxList
                        options={filterOptions.requestTypes}
                        selectedValues={localFilters.requestTypes || []}
                        onChange={(values) => updateLocalFilter('requestTypes', values)}
                        placeholder="Loading request types..."
                      />
                    )}
                  </FilterTab>
                </div>
              </TabsContent>

              <TabsContent value="more" className="mt-0">
                <div className="space-y-6">
                  <FilterTab title="Education Levels" count={localFilters.levels?.length || 0}>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <CheckboxList
                        options={filterOptions.levels}
                        selectedValues={localFilters.levels || []}
                        onChange={(values) => updateLocalFilter('levels', values)}
                        placeholder="Loading education levels..."
                      />
                    )}
                  </FilterTab>

                  <FilterTab title="Urgency" count={localFilters.urgencyLevels?.length || 0}>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <CheckboxList
                        options={filterOptions.urgencyLevels}
                        selectedValues={localFilters.urgencyLevels || []}
                        onChange={(values) => updateLocalFilter('urgencyLevels', values)}
                        placeholder="Loading urgency levels..."
                      />
                    )}
                  </FilterTab>

                  <FilterTab title="Locations" count={localFilters.locations?.length || 0}>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <CheckboxList
                        options={filterOptions.locations}
                        selectedValues={localFilters.locations || []}
                        onChange={(values) => updateLocalFilter('locations', values)}
                        placeholder="Loading locations..."
                      />
                    )}
                  </FilterTab>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
