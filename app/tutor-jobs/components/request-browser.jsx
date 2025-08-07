"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Clock, Users, DollarSign, LibraryBig, Eye, Coins, Calendar, MessageCircle, AlertTriangle, Star, User, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import AuthModal from "@/components/auth-modal"
import { useUser } from "@/contexts/UserContext"
import { calculateContactCost, getPopularityLevel, getUrgencyInfo } from "@/lib/contactPricing"
import { contactStudent, incrementRequestViewCount } from "@/lib/supabaseAPI"
import { toast } from "sonner"

// Add custom styles for line clamping
const lineClampStyles = {
  'line-clamp-2': {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  }
}

export default function RequestBrowser({ initialRequests, searchQuery: propSearchQuery, sortBy: propSortBy }) {
  const { user, profile, refreshUserData } = useUser()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || "")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [contactingRequest, setContactingRequest] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = initialRequests.filter((request) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          request.subjects?.some((subject) => subject.name?.toLowerCase().includes(query)) ||
          request.description?.toLowerCase().includes(query) ||
          request.address?.city?.toLowerCase().includes(query) ||
          request.address?.state?.toLowerCase().includes(query) ||
          request.type?.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }
      return true
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (propSortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "price-high":
          return parseFloat(b.price_amount || 0) - parseFloat(a.price_amount || 0)
        case "price-low":
          return parseFloat(a.price_amount || 0) - parseFloat(b.price_amount || 0)
        case "urgent":
          const urgencyOrder = { urgent: 3, 'within a week': 2, flexible: 1 }
          return (urgencyOrder[b.urgency?.toLowerCase()] || 0) - (urgencyOrder[a.urgency?.toLowerCase()] || 0)
        case "popular":
          return (b.view_count || 0) - (a.view_count || 0)
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

    return filtered
  }, [initialRequests, searchQuery, propSortBy])

  const handleContactStudent = async (request) => {
    if (!user || !profile) {
      setShowAuthModal(true)
      return
    }

    const cost = calculateContactCost(request)

    if (profile.coin_balance < cost) {
      toast.error(`Insufficient coins. You need ${cost} coins to contact this student.`)
      return
    }

    setContactingRequest(request.id)

    try {
      // Use actual API to deduct coins and contact student
      const result = await contactStudent(user.email, request.id, cost)

      if (result.error) {
        throw new Error(result.error.message || 'Failed to contact student')
      }

      // Refresh user data to update coin balance
      await refreshUserData()

      toast.success(`Contact initiated! ${cost} coins deducted from your balance.`)
      setSelectedRequest(null)
    } catch (error) {
      console.error('Contact error:', error)
      toast.error("Failed to contact student. Please try again.")
    } finally {
      setContactingRequest(null)
    }
  }

  const handleViewDetails = async (request) => {
    // Navigate to the detailed request page
    router.push(`/tutor-jobs/${request.id}`)
  }

  const handleCopyRequestId = (requestId) => {
    navigator.clipboard.writeText(requestId)
    toast.success("Request ID copied to clipboard!")
  }

  const RequestCard = ({ request }) => {
    console.log('Rendering RequestCard for request:', request)
    console.log('Request subjects:', request.subjects)
    console.log('Request subjects type:', typeof request.subjects)
    console.log('Request subjects length:', request.subjects?.length)
    
    const urgencyInfo = getUrgencyInfo(request.urgency)
    const popularityInfo = getPopularityLevel(request.view_count || 0)
    const contactCost = calculateContactCost(request)
    const timeAgo = new Date(request.created_at).toLocaleDateString()

    return (
      <Card className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 rounded-lg w-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Left side - Title and content */}
            <div className="flex-1 pr-4">
              {/* Header with badges */}
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${getTypeColor(request.type)} rounded-full text-xs font-medium`}>
                  <User className="w-3 h-3 mr-1" />
                  {request.type}
                </Badge>
                <Badge className={`${urgencyInfo.color} rounded-full text-xs`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {urgencyInfo.level}
                </Badge>
                <Badge className={`${popularityInfo.color} rounded-full text-xs`}>
                  <Star className="w-3 h-3 mr-1" />
                  {popularityInfo.level}
                </Badge>
              </div>

              {/* Clickable Title */}
              <h3
                className="font-semibold text-xl text-blue-700 mb-3 cursor-pointer hover:text-blue-800 transition-colors leading-tight"
                onClick={() => handleViewDetails(request)}
              >
                {request.title || `${request.type} tutor needed in ${request.address?.city || 'Remote'}`}
              </h3>

              {/* Subject tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {request.subjects && request.subjects.length > 0 ? (
                  request.subjects.map((subject, index) => (
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
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                {request.description}
              </p>

              {/* Student name */}
              <div className="text-gray-900 font-medium mb-4">
                {request.student_name || request.user?.name || 'Student'}
              </div>
            </div>

            {/* Right side - Request ID and copy button */}
            <div className="flex items-start gap-2">
              <div className="text-xs text-gray-500 font-mono">
                #{request.id.slice(-8)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => handleCopyRequestId(request.id)}
              >
                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Bottom section with metadata and actions */}
          <div className="flex items-center justify-between">
            {/* Left side metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {/* Time ago */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{timeAgo}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{request.address?.city || 'Remote'}, {request.address?.state || request.address?.country || 'Global'}</span>
              </div>

              {/* Budget */}
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${request.price_amount}</span>
              </div>

              {/* Coin cost */}
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                <span>{contactCost} coins</span>
              </div>

              {/* Views and Applications */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{request.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{request.contacted_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Right side - Meeting types and action button */}
            <div className="flex items-center gap-4">
              {/* Meeting preferences */}
              <div className="flex gap-2">
                {request.online_meeting && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </div>
                )}
                {request.offline_meeting && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    In-person
                  </div>
                )}
                {request.travel_meeting && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs text-purple-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Travel
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleViewDetails(request)}
              >
                View Details
                <Eye className="w-3 h-3 ml-1" />
              </Button>
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

  return (
    <div className="space-y-6">

      {/* Requests List */}
      <div className="space-y-4">
        {filteredAndSortedRequests.map(request => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>

      {filteredAndSortedRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria to find more opportunities.
          </p>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Request Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeColor(selectedRequest.type)}>
                  {selectedRequest.type}
                </Badge>
                <Badge className={getUrgencyInfo(selectedRequest.urgency).color}>
                  {getUrgencyInfo(selectedRequest.urgency).level}
                </Badge>
                <Badge className={getPopularityLevel(selectedRequest.view_count || 0).color}>
                  {getPopularityLevel(selectedRequest.view_count || 0).level} Demand
                </Badge>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="font-semibold mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.subjects && selectedRequest.subjects.length > 0 ? (
                    selectedRequest.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline">
                        {subject?.name || subject?.subject?.name || subject}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">
                      General Subject
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Budget</h4>
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedRequest.price_amount}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-gray-700">{getUrgencyInfo(selectedRequest.urgency).description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-gray-700">
                    {selectedRequest.address?.city}, {selectedRequest.address?.state}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Meeting Preferences</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRequest.online_meeting && <Badge variant="outline">Online</Badge>}
                    {selectedRequest.offline_meeting && <Badge variant="outline">In-person</Badge>}
                    {selectedRequest.travel_meeting && <Badge variant="outline">Travel</Badge>}
                  </div>
                </div>
              </div>

              {/* Languages */}
              {selectedRequest.language && selectedRequest.language.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Preferred Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.language.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {typeof lang === 'string' ? lang : lang.label || lang.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Contact Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Contact Cost: {calculateContactCost(selectedRequest)} Coins
                </h4>
                <div className="text-sm text-gray-600 mb-4">
                  <p>Cost calculated based on:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Urgency: {getUrgencyInfo(selectedRequest.urgency).level}</li>
                    <li>Budget: ${selectedRequest.price_amount}</li>
                    <li>Popularity: {selectedRequest.view_count || 0} views</li>
                    <li>Subject demand</li>
                  </ul>
                  <p className="mt-2">
                    {user && profile ? (
                      <>Your current balance: <strong>{profile.coin_balance} coins</strong></>
                    ) : (
                      <>Sign in to view your coin balance</>
                    )}
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={() => handleContactStudent(selectedRequest)}
                  disabled={contactingRequest === selectedRequest.id || (user && profile && profile.coin_balance < calculateContactCost(selectedRequest))}
                >
                  {contactingRequest === selectedRequest.id ? (
                    "Contacting..."
                  ) : !user || !profile ? (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Sign In to Contact Student
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Student ({calculateContactCost(selectedRequest)} coins)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Auth Modal for non-logged-in users */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <User className="w-6 h-6 text-blue-500" />
              Sign In Required
            </DialogTitle>
            <DialogDescription>
              Please sign in or create an account to contact students and access pricing details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 py-4">
            <AuthModal 
              defaultRole="tutor" 
              triggerText="Sign In / Create Account"
            />
            
            <Button 
              variant="outline" 
              onClick={() => setShowAuthModal(false)}
              className="w-full"
            >
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
