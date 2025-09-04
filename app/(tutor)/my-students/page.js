"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useUser } from "@/contexts/UserContext"
import { getTutorStudents, startConversation } from "@/lib/supabaseAPI"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar,
  MapPin,
  GraduationCap,
  IndianRupee,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  User,
  BookOpen,
  Globe,
  Users,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  PiggyBank
} from "lucide-react"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MyStudentsPage() {
  const { user, profile } = useUser()
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [lastRefresh, setLastRefresh] = useState(Date.now()) // Track refresh time

  // Define fetchMyStudents before using it in useEffect
  const fetchMyStudents = useCallback(async () => {
    if (!user?.email) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await getTutorStudents(user.email)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch students')
      }
      
      // Validate and sanitize data
      const validStudents = (result.data || []).filter(student => {
        return student && student.id && student.student_name
      })
      
      setAllStudents(validStudents)
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (user?.email) {
      fetchMyStudents()
    }
  }, [user?.email, lastRefresh, fetchMyStudents]) // Include lastRefresh as dependency

  // Enhanced filter and sort functionality
  const students = useMemo(() => {
    let filtered = [...allStudents] // Create copy to avoid mutations

    // Search filter with enhanced matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(student => {
        const searchableText = [
          student.student_name,
          student.title,
          student.description,
          ...(student.subjects || []).map(s => s.name),
          student.address?.city,
          student.address?.country
        ].filter(Boolean).join(' ').toLowerCase()
        
        return searchableText.includes(query)
      })
    }

    // Status filter with proper validation
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => {
        const studentStatus = student.status || 'open'
        return studentStatus === statusFilter
      })
    }

    // Enhanced sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.contacted_at || 0) - new Date(a.contacted_at || 0)
        case 'oldest':
          return new Date(a.contacted_at || 0) - new Date(b.contacted_at || 0)
        case 'name':
          return (a.student_name || '').localeCompare(b.student_name || '')
        case 'price-high':
          return (b.price_amount || 0) - (a.price_amount || 0)
        case 'price-low':
          return (a.price_amount || 0) - (b.price_amount || 0)
        case 'status':
          return (a.status || 'open').localeCompare(b.status || 'open')
        default:
          return new Date(b.contacted_at || 0) - new Date(a.contacted_at || 0)
      }
    })

    return filtered
  }, [allStudents, searchQuery, statusFilter, sortBy])

  const handleStartConversation = async (student) => {
    if (!user?.id || !student.user_id) return;
    
    try {
      // Create initial message to start conversation
      const result = await startConversation(
        user.id, 
        student.user_id, 
        student.id,
        `Hi ${student.student_name}, I'm interested in helping you with your "${student.title}" request. I'd love to discuss how I can assist you. Feel free to reach out!`
      );
      
      if (result.error) {
        console.error('Error starting conversation:', result.error);
        // Fallback to direct navigation
        window.location.href = `/messages/${student.user_id}`;
        return;
      }
      
      // Navigate to the conversation
      window.location.href = `/messages/${student.user_id}`;
    } catch (error) {
      console.error('Error starting conversation:', error);
      // Fallback to direct navigation
      window.location.href = `/messages/${student.user_id}`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount, currency = 'INR', symbol = '₹') => {
    return `${symbol}${amount?.toFixed(2) || '0.00'}`
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMeetingTypeIcon = (request) => {
    const types = []
    if (request.online_meeting) types.push('Online')
    if (request.offline_meeting) types.push('In-person')
    if (request.travel_meeting) types.push('Travel')
    return types.join(', ') || 'Not specified'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchMyStudents} 
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Refresh Button */}
        {!loading && allStudents.length > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {students.length} of {allStudents.length} students
              {allStudents.length > 0 && (
                <span className="ml-2 text-gray-400">
                  • Last updated: {new Date(lastRefresh).toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setLastRefresh(Date.now())}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {/* Quick Actions */}
              {students.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Export as CSV functionality
                    const csvData = students.map(s => ({
                      Name: s.student_name,
                      Email: s.student_email,
                      Request: s.title,
                      Status: s.status || 'open',
                      Price: `${s.price_currency_symbol}${s.price_amount}`,
                      ContactedAt: s.contacted_at
                    }))
                    
                    const csv = [
                      Object.keys(csvData[0]).join(','),
                      ...csvData.map(row => Object.values(row).join(','))
                    ].join('\n')
                    
                    const blob = new Blob([csv], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `my-students-${new Date().toISOString().split('T')[0]}.csv`
                    a.click()
                    window.URL.revokeObjectURL(url)
                  }}
                >
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        )}

        {students.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {allStudents.length === 0 ? "No Students Yet" : "No students match your filters"}
              </h3>
              <p className="text-gray-500 mb-6">
                {allStudents.length === 0 
                  ? "You haven't contacted any students yet. Browse available tutoring requests to connect with students who need your expertise."
                  : "Try adjusting your search or filter criteria to find students."
                }
              </p>
              {allStudents.length === 0 && (
                <Button 
                  onClick={() => window.location.href = '/tutor-jobs'}
                  className="bg-black hover:bg-gray-800"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Tutoring Jobs
                </Button>
              )}
              {allStudents.length > 0 && (
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setSortBy("newest")
                    }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        {students.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{allStudents.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {allStudents.filter(s => s.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600">Open Requests</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {allStudents.reduce((sum, s) => sum + (s.coin_cost || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Coins Spent</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.student_avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.student_name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Contacted {formatDate(student.contacted_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(student.status)}>
                    {student.status?.replace('_', ' ') || 'Open'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Request Title */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {student.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {student.description}
                  </p>
                </div>

                {/* Subjects */}
                {student.subjects && student.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {student.subjects.slice(0, 3).map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject.name}
                      </Badge>
                    ))}
                    {student.subjects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{student.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <Separator />

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <PiggyBank className="h-4 w-4" />
                    <span>{formatCurrency(student.price_amount, student.price_currency, student.price_currency_symbol)}</span>
                    <span className="text-xs">({student.price_option})</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{student.level || 'Any level'}</span>
                    <span className="text-gray-400">•</span>
                    <span>{student.type || 'General'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>{getMeetingTypeIcon(student)}</span>
                  </div>

                  {student.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{student.address.city}, {student.address.state}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Contact cost: {student.coin_cost} coins</span>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-gray-900">Contact Details:</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{student.student_email}</span>
                    </div>
                    {student.student_phone && student.student_phone !== 'Phone not available' && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{student.student_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  disabled={!student.user_id}
                  onClick={() => handleStartConversation(student)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/tutor-jobs/${student.id}`}
                >
                  View Request
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
