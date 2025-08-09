"use client"

import { Clock, MapPin, DollarSign, Monitor, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function QuickFilters({ onFilterSelect, activeFilters = [] }) {
  const quickFilters = [
    {
      id: 'urgent',
      label: 'Urgent Only',
      icon: Clock,
      color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      filter: { urgencyLevels: ['high'] } // Using 'High' to match the actual data
    },
    {
      id: 'online',
      label: 'Online',
      icon: Monitor,
      color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      filter: { meetingTypes: ['online'] } // Using 'Online' to match the actual data
    },
    {
      id: 'high-pay',
      label: '$50+ /hour',
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      filter: { minPrice: 50 }
    },
    {
      id: 'tutoring',
      label: 'Tutoring',
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      filter: { requestTypes: ['Tutoring'] }
    },
    {
      id: 'assignment',
      label: 'Assignment Help',
      icon: Zap,
      color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      filter: { requestTypes: ['Assignment'] } // Using 'Assignment Help' to match the actual data
    },
    {
      id: 'local',
      label: 'In-Person',
      icon: MapPin,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
      filter: { meetingTypes: ['offline'] } // Using 'Offline' to match the actual data
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
