"use client"

import { TrendingUp, Clock, IndianRupee, MapPin, BookOpen, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SearchSummary({ requests, filters, isLoading = false }) {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate statistics
  const totalRequests = requests.length
  
  const stats = {
    averagePrice: requests.length > 0 
      ? Math.round(requests.reduce((sum, req) => sum + (parseFloat(req.price_amount) || 0), 0) / requests.length)
      : 0,
    
    urgentRequests: requests.filter(req => 
      req.urgency?.toLowerCase() === 'urgent' || req.urgency?.toLowerCase() === 'asap'
    ).length,
    
    onlineRequests: requests.filter(req => req.online_meeting === true).length,
    
    topSubjects: getTopSubjects(requests),
    topLocations: getTopLocations(requests),
    recentRequests: requests.filter(req => {
      const createdAt = new Date(req.created_at)
      const now = new Date()
      const diffInHours = (now - createdAt) / (1000 * 60 * 60)
      return diffInHours <= 24
    }).length
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'number') return value !== 0 && value !== 10000
    return false
  })

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {totalRequests} {totalRequests === 1 ? 'opportunity' : 'opportunities'} found
              {hasActiveFilters && ' (filtered)'}
            </h3>
            <p className="text-sm text-gray-600">
              {hasActiveFilters 
                ? 'Based on your current filter selections'
                : 'Showing all available tutoring opportunities'
              }
            </p>
          </div>
          {hasActiveFilters && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filtered
            </Badge>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
              <IndianRupee className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">${stats.averagePrice}</div>
            <div className="text-xs text-gray-600">Avg. Rate</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-1">
              <Clock className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{stats.urgentRequests}</div>
            <div className="text-xs text-gray-600">Urgent</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <div className="text-lg font-bold text-gray-900">{stats.onlineRequests}</div>
            <div className="text-xs text-gray-600">Online</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{stats.recentRequests}</div>
            <div className="text-xs text-gray-600">New (24h)</div>
          </div>
        </div>

        {/* Top Subjects and Locations */}
        {(stats.topSubjects.length > 0 || stats.topLocations.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {stats.topSubjects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Popular Subjects
                </h4>
                <div className="flex flex-wrap gap-1">
                  {stats.topSubjects.slice(0, 3).map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {subject.name} ({subject.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {stats.topLocations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Active Locations
                </h4>
                <div className="flex flex-wrap gap-1">
                  {stats.topLocations.slice(0, 3).map((location, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {location.name} ({location.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper functions
function getTopSubjects(requests) {
  const subjectCounts = {}
  
  requests.forEach(request => {
    if (request.subjects && Array.isArray(request.subjects)) {
      request.subjects.forEach(subject => {
        const name = subject.name || subject
        if (name) {
          subjectCounts[name] = (subjectCounts[name] || 0) + 1
        }
      })
    }
  })
  
  return Object.entries(subjectCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

function getTopLocations(requests) {
  const locationCounts = {}
  
  requests.forEach(request => {
    if (request.address && (request.address.city || request.address.state)) {
      const location = request.address.city && request.address.state 
        ? `${request.address.city}, ${request.address.state}`
        : request.address.city || request.address.state || 'Remote'
      
      locationCounts[location] = (locationCounts[location] || 0) + 1
    }
  })
  
  return Object.entries(locationCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
