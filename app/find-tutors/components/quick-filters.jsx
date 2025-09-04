"use client"

import { Clock, MapPin, IndianRupee, Monitor, Users, Zap, Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function QuickFilters({ onFilterSelect, activeFilters = [] }) {
  const quickFilters = [
    {
      id: 'top-rated',
      label: '4.8+ Stars',
      icon: Star,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      filter: { minRating: 4.8 }
    },
    {
      id: 'verified',
      label: 'Verified Tutors',
      icon: Award,
      color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      filter: { verified: true }
    },
    {
      id: 'online',
      label: 'Online Tutoring',
      icon: Monitor,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      filter: { meetingTypes: ['online'] }
    },
    {
      id: 'available-now',
      label: 'Available Now',
      icon: Clock,
      color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      filter: { availabilityStatus: 'available' }
    },
    {
      id: 'budget-friendly',
      label: 'Under ₹30/hr',
      icon: IndianRupee,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      filter: { maxPrice: 30 }
    },
    {
      id: 'in-person',
      label: 'In-Person',
      icon: MapPin,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
      filter: { meetingTypes: ['in_person'] }
    }
  ]

  const isActive = (filterId) => {
    return activeFilters.includes(filterId)
  }

  const handleQuickFilter = (quickFilter) => {
    onFilterSelect(quickFilter.filter, quickFilter.id)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700 flex items-center mr-2">
        Quick filters:
      </span>
      {quickFilters.map(filter => {
        const Icon = filter.icon
        const active = isActive(filter.id)
        
        return (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            className={`${filter.color} ${active ? 'ring-2 ring-offset-1' : ''} transition-all`}
            onClick={() => handleQuickFilter(filter)}
          >
            <Icon className="w-4 h-4 mr-1" />
            {filter.label}
            {active && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center">
                ✓
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}
