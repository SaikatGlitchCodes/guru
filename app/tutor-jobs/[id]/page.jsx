"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import AuthModal from "@/components/auth-modal"
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Phone, 
  User, 
  Globe, 
  Home, 
  Car, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Coins,
  Calendar,
  Star,
  Mail,
  Copy,
  ExternalLink,
  Shield,
  Award,
  Eye,
  Users,
  BookOpen,
  Languages,
  Target,
  Zap,
  Heart,
  GraduationCap,
  Timer,
  UserCheck
} from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { calculateContactCost, getPopularityLevel, getUrgencyInfo } from "@/lib/contactPricing"
import { contactStudent, incrementRequestViewCount, getRequestById } from "@/lib/supabaseAPI"
import { toast } from "sonner"

export default function RequestDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, profile, refreshUserData } = useUser()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [hasContacted, setHasContacted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Fetch request data from API
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true)
        
        // Fetch the actual request data with tutor email to check if already paid
        const result = await getRequestById(id, user?.email)
        
        if (result.error) {
          throw new Error(result.error.message || 'Failed to fetch request')
        }
        
        if (!result.data) {
          throw new Error('Request not found')
        }
        
        setRequest(result.data)
        
        // If user has already paid, show contact modal immediately
        if (result.data.hasAlreadyPaid) {
          setHasContacted(true)
          setShowContactModal(true)
        }
        
        // Increment view count
        await incrementRequestViewCount(id)
      } catch (error) {
        console.error("Error fetching request:", error)
        toast.error("Failed to load request details")
        setRequest(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRequest()
    }
  }, [id, user?.email])

  const handleContactStudent = async () => {
    // Check if user is logged in first
    if (!user || !profile) {
      setShowAuthModal(true)
      return
    }

    // If already paid, just show the modal
    if (request?.hasAlreadyPaid) {
      setShowContactModal(true)
      return
    }

    const cost = calculateContactCost(request)
    
    if (profile.coin_balance < cost) {
      toast.error(`Insufficient coins. You need ${cost} coins to contact this student.`)
      return
    }

    setContacting(true)
    
    try {
      const result = await contactStudent(user.email, request.id, cost)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to contact student')
      }
      
      await refreshUserData()
      setHasContacted(true)
      setShowContactModal(true)
      toast.success(`Contact initiated! ${cost} coins deducted from your balance.`)
      
    } catch (error) {
      console.error('Contact error:', error)
      toast.error("Failed to contact student. Please try again.")
    } finally {
      setContacting(false)
    }
  }

  const handleCopyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const handleOpenWhatsApp = () => {
    // Use the secure phone field that's only available after payment
    const phoneNumber = request?.contactInfoAvailable 
      ? request.student_phone?.replace(/\D/g, '')
      : null
    
    if (phoneNumber && phoneNumber !== 'Contact details available after payment') {
      window.open(`https://wa.me/${phoneNumber}`, '_blank')
    } else {
      toast.error("Phone number not available")
    }
  }

  const handleOpenEmail = () => {
    // Use the secure email field that's only available after payment
    const email = request?.contactInfoAvailable 
      ? request.student_email
      : null
      
    if (email && email !== 'Contact details available after payment') {
      window.open(`mailto:${email}`, '_blank')
    } else {
      toast.error("Email not available")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request not found</h2>
          <p className="text-gray-600 mb-4">The request you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const urgencyInfo = getUrgencyInfo(request.urgency || 'flexible')
  const popularityInfo = getPopularityLevel(request.view_count || 0)
  const contactCost = calculateContactCost(request)
  const timeAgo = Math.floor((Date.now() - new Date(request.created_at).getTime()) / (1000 * 60 * 60))
  const usdPrice = (parseFloat(request.price_amount || 0) * 1.18).toFixed(2) // Mock conversion rate

  const shouldShowRecommendation = (request.contacted_count || 0) >= 4

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                {request?.view_count || 0} views
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {request?.contacted_count || 0} applied
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 ">
            {/* Student Profile Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-black to-black rounded-t-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{request?.student_name || 'Student'}</h1>
                      <p className="text-blue-100">Looking for a tutor</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{request?.address?.city || 'Remote'}, {request?.address?.country || 'Global'}</span>
                        </div>
                        {request?.phone_verified && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-300" />
                            <span className="text-sm">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{request?.price_currency_symbol || '€'}{request?.price_amount || '0'}</div>
                    <div className="text-blue-100 text-sm">per hour</div>
                  </div>
                </div>
              </div>

              {/* Subject Tags */}
              <div className="p-6 border-b">
                <div className="flex flex-wrap gap-2">
                  {(request?.subjects || []).map((subject, index) => (
                    <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subject.name}
                    </Badge>
                  ))}
                  {(!request?.subjects || request.subjects.length === 0) && (
                    <Badge className="bg-gray-50 text-gray-600">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      General Tutoring
                    </Badge>
                  )}
                </div>
              </div>

              {/* Key Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request?.level || 'All Levels'}</p>
                      <p className="text-sm text-gray-500">Skill Level</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Timer className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request?.schedule || 'Flexible'}</p>
                      <p className="text-sm text-gray-500">Schedule</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request?.gender_preference || 'No Preference'}</p>
                      <p className="text-sm text-gray-500">Gender Preference</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Posted {Math.floor((Date.now() - new Date(request?.created_at).getTime()) / (1000 * 60 * 60))} hours ago</p>
                      <p className="text-sm text-gray-500">Timeline</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Already Paid Alert */}
            {request?.hasAlreadyPaid && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Great news!</strong> You've already paid for this request. You can access the student's contact details anytime.
                </AlertDescription>
              </Alert>
            )}

            {/* High Competition Alert */}
            {shouldShowRecommendation && !request?.hasAlreadyPaid && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  <strong>High Competition:</strong> {(request?.contacted_count || 0)} tutors have already applied for this position.
                </AlertDescription>
              </Alert>
            )}

            {/* Learning Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Learning Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {request?.description || "Detailed learning objectives will be shared after you contact the student."}
                </p>
              </CardContent>
            </Card>

            {/* Teaching Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Teaching Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Meeting Types */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Preferred Meeting Types</h4>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 p-2 rounded-lg ${request?.online_meeting ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Globe className="w-4 h-4" />
                        <span>Online Sessions</span>
                        {request?.online_meeting ? <CheckCircle className="w-4 h-4 ml-auto" /> : <XCircle className="w-4 h-4 ml-auto" />}
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded-lg ${request?.offline_meeting ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Home className="w-4 h-4" />
                        <span>In-Person Sessions</span>
                        {request?.offline_meeting ? <CheckCircle className="w-4 h-4 ml-auto" /> : <XCircle className="w-4 h-4 ml-auto" />}
                      </div>
                      <div className={`flex items-center gap-2 p-2 rounded-lg ${request?.travel_meeting ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                        <Car className="w-4 h-4" />
                        <span>Tutor Can Travel</span>
                        {request?.travel_meeting ? <CheckCircle className="w-4 h-4 ml-auto" /> : <XCircle className="w-4 h-4 ml-auto" />}
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Communication Languages</h4>
                    {request?.language && request.language.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {request.language.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            <Languages className="w-3 h-3 mr-1" />
                            {lang.label}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Language preferences not specified</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  {request?.hasAlreadyPaid ? 'Contact Details' : 'Apply for this Job'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {request?.hasAlreadyPaid ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Already Purchased</span>
                      </div>
                      <p className="text-green-600 text-sm">
                        You've already paid for this request. Click below to view contact details.
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setShowContactModal(true)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Contact Details
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {calculateContactCost(request)} Coins
                      </div>
                      <p className="text-sm text-blue-600">Required to contact student</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Your balance:</span>
                        <span className="font-medium">{profile?.coin_balance || 0} coins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>After purchase:</span>
                        <span className="font-medium">{(profile?.coin_balance || 0) - calculateContactCost(request)} coins</span>
                      </div>
                    </div>

                    {!user || !profile ? (
                      <Alert className="p-3 border-blue-200 bg-blue-50">
                        <User className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-sm text-blue-700">
                          Please sign in to contact the student and view pricing details.
                        </AlertDescription>
                      </Alert>
                    ) : profile.coin_balance < calculateContactCost(request) && (
                      <Alert className="p-3">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Insufficient coins. You need {calculateContactCost(request) - profile.coin_balance} more coins.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleContactStudent}
                      disabled={contacting || (user && profile && profile.coin_balance < calculateContactCost(request))}
                    >
                      {contacting ? (
                        "Processing..."
                      ) : !user || !profile ? (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Sign In to Contact Student
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Contact Student
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Job Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Job Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{request?.view_count || 0}</div>
                    <div className="text-xs text-blue-600">Views</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{request?.contacted_count || 0}</div>
                    <div className="text-xs text-green-600">Applied</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Popularity</span>
                    <Badge variant="outline" className={getPopularityLevel(request?.view_count || 0).color}>
                      {getPopularityLevel(request?.view_count || 0).level}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Competition</span>
                    <Badge variant="outline" className={(request?.contacted_count || 0) >= 3 ? "border-red-200 text-red-700" : "border-green-200 text-green-700"}>
                      {(request?.contacted_count || 0) >= 3 ? "High" : "Low"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Student Status</span>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Why Choose This Job?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified student profile</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Competitive hourly rate</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Clear learning objectives</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Flexible scheduling options</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Student Contact Details
            </DialogTitle>
            <DialogDescription>
              {request?.hasAlreadyPaid 
                ? "Here are the contact details you've already purchased."
                : "You can now contact the student directly using the information below."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Student Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Student Information
              </h4>
              <p className="text-gray-700">
                <strong>Name:</strong> {request?.student_name || 'Student Name'}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {/* Email */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Email</span>
                    {request?.contactInfoAvailable && (
                      <Shield className="w-4 h-4 text-green-500" title="Verified Contact" />
                    )}
                  </div>
                  {request?.contactInfoAvailable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(request?.student_email || '', 'Email')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className={`font-mono text-sm p-2 rounded ${
                  request?.contactInfoAvailable 
                    ? 'text-gray-700 bg-gray-50' 
                    : 'text-orange-600 bg-orange-50'
                }`}>
                  {request?.student_email || 'Contact details available after payment'}
                </p>
                {request?.contactInfoAvailable ? (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={handleOpenEmail}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                ) : (
                  <div className="mt-2 text-sm text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Pay to unlock contact details
                  </div>
                )}
              </div>

              {/* Phone/WhatsApp */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="font-medium">WhatsApp</span>
                    {request?.contactInfoAvailable && request?.phone_verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="Verified Phone" />
                    )}
                    {request?.contactInfoAvailable && (
                      <Shield className="w-4 h-4 text-green-500" title="Verified Contact" />
                    )}
                  </div>
                  {request?.contactInfoAvailable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(request?.student_phone || '', 'Phone number')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className={`font-mono text-sm p-2 rounded ${
                  request?.contactInfoAvailable 
                    ? 'text-gray-700 bg-gray-50' 
                    : 'text-orange-600 bg-orange-50'
                }`}>
                  {request?.student_phone || 'Contact details available after payment'}
                </p>
                {request?.contactInfoAvailable ? (
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                    onClick={handleOpenWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open WhatsApp
                  </Button>
                ) : (
                  <div className="mt-2 text-sm text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Pay to unlock contact details
                  </div>
                )}
              </div>
            </div>

            {/* Success Message */}
            {!request?.hasAlreadyPaid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Payment Successful!</span>
                </div>
                <p className="text-green-600 text-sm">
                  {calculateContactCost(request)} coins have been deducted. Good luck with your application!
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
