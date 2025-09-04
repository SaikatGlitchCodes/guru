"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { getUserRequests, updateRequestStatus } from "@/lib/supabaseAPI"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  Eye,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

export default function StudentRequestsPage() {
  const { user, profile, loading: userLoading } = useUser()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [closingRequest, setClosingRequest] = useState(null)
  const [showCloseDialog, setShowCloseDialog] = useState(null)

  // Debug logging
  useEffect(() => {
    console.log('StudentRequestsPage - user:', user)
    console.log('StudentRequestsPage - profile:', profile)
    console.log('StudentRequestsPage - userLoading:', userLoading)
  }, [user, profile, userLoading])

  useEffect(() => {
    // Wait for user loading to complete and user to be available
    if (!userLoading && user?.email) {
      fetchRequests()
    } else if (!userLoading && !user) {
      setLoading(false)
    }
  }, [user, userLoading, requests.length])

  const fetchRequests = async () => {
    if (!user?.email) {
      console.log('No user email available')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log('Fetching requests for user:', user.email, user.id)
      
      // Use user email instead of profile.user_id
      const result = await getUserRequests(user.id)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch requests')
      }

      console.log('Fetched requests:', result.data)
      setRequests(result.data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load your requests')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseRequest = async (requestId) => {
    if (!user?.email) {
      toast.error('Authentication required')
      return
    }
    console.log('Closing request:', requestId, 'for user:', user.email)

    try {
      setClosingRequest(requestId)
      
      const result = await updateRequestStatus(requestId, 'completed', user.id)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to close request')
      }

      // Update the local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'closed' }
            : req
        )
      )

      setShowCloseDialog(null)
      toast.success('Request closed successfully')
    } catch (error) {
      console.error('Error closing request:', error)
      toast.error(error.message || 'Failed to close request')
    } finally {
      setClosingRequest(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Open', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: XCircle },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig.open
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMs = now - past
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      return `${diffInDays} days ago`
    }
  }

  // Show loading while user context is loading or while fetching requests
  if (userLoading || (loading && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show authentication error if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your requests.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show loading while fetching requests
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">Manage your tutor requests and track their status</p>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any tutor requests. Create your first request to get started!
              </p>
              <Button onClick={() => window.location.href = '/request-tutor'}>
                Request a Tutor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {request.title || `${request.type} tutor needed`}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {getTimeAgo(request.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {request.view_count || 0} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {request.contacted_count || 0} tutors contacted
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      {request.status === 'open' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCloseDialog(request.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Close request"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Request Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Type & Level</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{request.type}</Badge>
                          <Badge variant="outline">{request.level}</Badge>
                        </div>
                      </div>
                      
                      {request.subjects && request.subjects.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1">
                            {request.subjects.slice(0, 3).map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject.subject?.name || subject.name}
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

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Budget</p>
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          {request.price_currency_symbol}
                          {request.price_amount} {request.price_option}
                        </div>
                      </div>
                      
                      {request.address && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {request.address.city}, {request.address.state}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.description && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {request.description}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Contact Activities */}
                  {request.contact_activities && request.contact_activities.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Tutors Contacted ({request.contact_activities.length})
                        </p>
                        <div className="space-y-2">
                          {request.contact_activities.slice(0, 3).map((contact, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={contact.tutor?.avatar_url || "/api/placeholder/32/32"} 
                                  alt={contact.tutor?.name || 'Tutor'}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-medium text-sm">{contact.tutor?.name || 'Anonymous Tutor'}</p>
                                  <p className="text-xs text-gray-500">{getTimeAgo(contact.contacted_at)}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Contacted
                              </Badge>
                            </div>
                          ))}
                          {request.contact_activities.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{request.contact_activities.length - 3} more tutors contacted
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action buttons for open requests */}
                  {request.status === 'open' && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Request is active and visible to tutors
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowCloseDialog(request.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Close Request
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Close Request Confirmation Dialog */}
      <Dialog open={showCloseDialog !== null} onOpenChange={(open) => !open && setShowCloseDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this request? This will:
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>Stop new tutors from contacting you</li>
                <li>Hide your request from search results</li>
                <li>Mark the request as closed</li>
              </ul>
              <p className="mt-2 text-sm font-medium">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCloseDialog(null)}
              disabled={closingRequest !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleCloseRequest(showCloseDialog)}
              disabled={closingRequest !== null}
            >
              {closingRequest ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Close Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
