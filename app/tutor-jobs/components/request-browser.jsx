"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Home,
  Car,
  Wifi,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Pagination from "@/components/ui/pagination"
import { getUrgencyInfo } from "@/lib/contactPricing"


// Helper function to calculate time ago
const getTimeAgo = (dateString) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInMs = now - past
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSeconds < 60) {
    return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
  } else {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
  }
}

export default function RequestBrowser({ 
  requests = [], 
  totalItems = 0,
  currentPage = 1, 
  itemsPerPage = 12,
  isLoading = false,
  onPageChange 
}) {
  const router = useRouter()

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Debug logging
  console.log('RequestBrowser props:', {
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    requestsLength: requests.length
  })

  const handlePageChange = (page) => {
    onPageChange?.(page)
    // Scroll to top of the results when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewDetails = async (request) => {
    router.push(`/tutor-jobs/${request.id}`)
  }

  const getStatusBadge = (urgency, isNew = false) => {
    const urgencyInfo = getUrgencyInfo(urgency)
    
    if (isNew) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          New
        </Badge>
      )
    }

    const urgencyConfig = {
      urgent: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      flexible: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      scheduled: { color: 'bg-purple-100 text-purple-800', icon: Calendar }
    }

    const config = urgencyConfig[urgency] || urgencyConfig.flexible
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {urgencyInfo.level}
      </Badge>
    )
  }

  const isNewRequest = (dateString) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffInHours = (now - created) / (1000 * 60 * 60)
    return diffInHours <= 24
  }

  const RequestCard = ({ request }) => {
    const timeAgo = getTimeAgo(request.created_at)
    const isNew = isNewRequest(request.created_at)

    return (
      <Card className="w-full max-w-full overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0 overflow-hidden">
              <CardTitle className="text-lg sm:text-xl cursor-pointer hover:text-blue-600 break-words" onClick={() => handleViewDetails(request)}>
                {request.title || `${request.type} Request for ${request.subjects?.map(s => s?.name || s?.subject?.name).join(', ') || 'Multiple Subjects'}`}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {getStatusBadge(request.urgency, isNew)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 overflow-hidden min-w-0">
          {/* Request Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3 min-w-0">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Type & Level</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{request.type}</Badge>
                  <Badge variant="outline" className="text-xs">{request.level}</Badge>
                </div>
              </div>
              
              {request.subjects && request.subjects.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {request.subjects.slice(0, 3).map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs break-all">
                        {subject?.name || subject?.subject?.name || subject}
                      </Badge>
                    ))}
                    {request.subjects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{request.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 min-w-0">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Budget</p>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{request.price_amount} / {request.price_option}</span>
                </div>
              </div>
              
              {request.address && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                  <div className="flex items-start gap-1 text-sm min-w-0">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="break-words">
                      {request.address.city || 'Remote'}, {request.address.state || request.address.country || 'Global'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meeting Options */}
          {(request.online_meeting || request.offline_meeting || request.travel_meeting) && (
            <>
              <div>
                <div className="flex flex-wrap gap-2">
                  {request.online_meeting && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
                      <Wifi className="w-3 h-3 flex-shrink-0" />
                      <span>Online</span>
                    </div>
                  )}
                  {request.offline_meeting && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                      <Home className="w-3 h-3 flex-shrink-0" />
                      <span>In-person</span>
                    </div>
                  )}
                  {request.travel_meeting && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700">
                      <Car className="w-3 h-3 flex-shrink-0" />
                      <span>Travel required</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {request.description && (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 overflow-hidden word-break">
                  {request.description}
                </p>
              </div>
            </>
          )}

          {/* Action button */}
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="text-sm text-gray-600 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span>Posted {timeAgo}</span>
                </div>
              </div>
            </div>
          </>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Card key={index} className="w-full max-w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (requests.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria to find more tutoring opportunities.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Results
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
      
      {/* Simple pagination test */}

        <div className="mt-4 border-t pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(3, totalPages)}
            totalItems={Math.max(36, totalItems)}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            showInfo={true}
            className="justify-center"
          />
        </div>
    
      
      {/* Results summary for single page */}
      {totalPages <= 1 && requests.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing {requests.length} tutoring opportunities
          </p>
        </div>
      )}
    </div>
  )
}
