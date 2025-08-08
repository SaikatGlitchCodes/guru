"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Users, Eye, Calendar, Star, User, Copy, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getPopularityLevel, getUrgencyInfo } from "@/lib/contactPricing"
import { toast } from "sonner"

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

export default function RequestBrowser({ initialRequests }) {
  const router = useRouter()

  const handleViewDetails = async (request) => {
    router.push(`/tutor-jobs/${request.id}`)
  }

  const handleCopyRequestId = (requestId) => {
    navigator.clipboard.writeText(requestId)
    toast.success("Request ID copied to clipboard!")
  }

  const RequestCard = ({ request }) => { 
    const urgencyInfo = getUrgencyInfo(request.urgency)
    const popularityInfo = getPopularityLevel(request.view_count || 0)
    const timeAgo = getTimeAgo(request.created_at)

    return (
      <Card className="group shadow-none hover:border-gray-300 hover:shadow-md transition-all duration-200 rounded-lg w-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Left side - Title and content */}
            <div className="flex-1 pr-4">
              {/* Header with badges */}
              <div className="flex items-center gap-2 mb-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={`${getTypeColor(request.type)} rounded-full text-xs font-medium`}>
                      <User className="w-3 h-3 mr-1" />
                      {request.type}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Type of tutoring service requested</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={`${urgencyInfo.color} rounded-full text-xs`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {urgencyInfo.level}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How urgently the student needs help</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={`${popularityInfo.color} rounded-full text-xs`}>
                      <Star className="w-3 h-3 mr-1" />
                      {popularityInfo.level}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Interest level from other tutors ({request.view_count || 0} views)</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* New requests badge */}
                {isNewRequest(request.created_at) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-green-100/80 text-green-800 border-green-200 rounded-full text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Posted within the last 24 hours</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Clickable Title */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3
                    className="font-semibold text-xl text-blue-700 mb-3 cursor-pointer hover:text-blue-800 transition-colors leading-tight"
                    onClick={() => handleViewDetails(request)}
                  >
                    {request.title || `${request.type} tutor needed in ${request.address?.city || 'Remote'}`}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view full request details</p>
                </TooltipContent>
              </Tooltip>

              {/* Subject tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {request.subjects && request.subjects.length > 0 ? (
                  request.subjects.slice(0, 4).map((subject, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {subject?.name || subject?.subject?.name || subject}
                    </Badge>
                  ))
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 border-gray-300 text-gray-700"
                  >
                    General Subject
                  </Badge>
                )}
                {request.subjects?.length > 4 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 border-blue-300 text-blue-700"
                      >
                        +{request.subjects.length - 4} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click "View Details" to see all {request.subjects.length} subjects</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                {request.description}
              </p>
            </div>

            {/* Right side - Request ID and copy button */}
            <div className="flex items-center gap-2 justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-gray-500 font-mono">
                    #{request.id.slice(-8)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Request ID: {request.id}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => handleCopyRequestId(request.id)}
                  >
                    <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy request ID to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Bottom section with metadata and actions */}
          <div className="flex items-center justify-between">
            {/* Left side metadata */}
            <div className="flex items-center gap-6 text-sm text-black">
              {/* Time ago */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{timeAgo}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Request posted on {new Date(request.created_at).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>

              {/* Location */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{request.address?.city || 'Remote'}, {request.address?.state || request.address?.country || 'Global'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Location where tutoring will take place</p>
                </TooltipContent>
              </Tooltip>

              {/* Budget */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    {request?.price_currency_symbol || '$'}
                    <span>{request.price_amount} {request?.price_option}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Student's budget for this request</p>
                </TooltipContent>
              </Tooltip>

              {/* View count if available */}
              {request.view_count > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{request.view_count}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of tutors who have viewed this request</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Right side - Meeting types and action button */}
            <div className="flex items-center gap-4">
              {/* Meeting preferences */}
              <div className="flex gap-2">
                {request.online_meeting && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Online
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Student accepts online tutoring sessions</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {request.offline_meeting && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        In-person
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Student prefers in-person tutoring at their location</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {request.travel_meeting && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Travel
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tutor will need to travel to student's location</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* View Details Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                    <Eye className="w-3 h-3 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View complete request details and apply</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "tutoring":
        return "bg-blue-100/80 text-blue-800 border-blue-200"
      case "assignment":
        return "bg-purple-100/80 text-purple-800 border-purple-200"
      case "job support":
        return "bg-orange-100/80 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100/80 text-gray-800 border-gray-200"
    }
  }

  const isNewRequest = (dateString) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffInHours = (now - created) / (1000 * 60 * 60)
    return diffInHours <= 24
  }

  if (initialRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Users className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your search criteria to find more opportunities.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Results
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-4">
          {initialRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>

        {/* Load more button could be added here for pagination */}
        {initialRequests.length > 0 && (
          <div className="text-center pt-8">
            <p className="text-sm text-gray-500">
              Showing {initialRequests.length} opportunities
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
