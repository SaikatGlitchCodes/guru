"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Star, 
  MapPin, 
  Clock, 
  BookOpen, 
  Award, 
  Languages, 
  Users, 
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  Video,
  GraduationCap,
  Coins,
  Lock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Heart,
  Shield
} from "lucide-react"
import { getTutorProfile, getUserCoins, purchaseContact, startConversation } from '@/lib/supabaseAPI'
import { useUser } from "@/contexts/UserContext"
import { toast } from "sonner"

export default function TutorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [tutor, setTutor] = useState(null)
  const [userCoins, setUserCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [contactPurchased, setContactPurchased] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const CONTACT_COST = 5 // Cost in coins to access contact details

  useEffect(() => {
    const loadTutorProfile = async () => {
      if (!params.id) return
      
      setLoading(true)
      try {
        const result = await getTutorProfile(params.id)
        if (result.error) {
          toast.error('Failed to load tutor profile')
          router.push('/find-tutors')
          return
        }
        
        setTutor(result.data)
        
        // Check if user has already purchased contact for this tutor
        if (user && result.data) {
          const coinsResult = await getUserCoins(user.id)
          if (!coinsResult.error) {
            setUserCoins(coinsResult.coins)
            // Check if user has contact access to this tutor by email
            setContactPurchased(coinsResult.hasContactAccess?.[result.data.email] || false)
          }
        }
      } catch (error) {
        console.error('Error loading tutor profile:', error)
        toast.error('Something went wrong')
        router.push('/find-tutors')
      } finally {
        setLoading(false)
      }
    }

    loadTutorProfile()
  }, [params.id, user, router])

  const handleContactPurchase = async () => {
    if (!user) {
      toast.error('Please sign in to contact tutors')
      return
    }

    if (userCoins < CONTACT_COST) {
      setShowInsufficientCoinsModal(true)
      return
    }

    setShowPaymentModal(true)
  }

  const confirmContactPurchase = async () => {
    setProcessingPayment(true)
    try {
      const result = await purchaseContact(tutor.id, CONTACT_COST)
      if (result.error) {
        toast.error(result.error)
        return
      }
      
      setContactPurchased(true)
      setUserCoins(prev => prev - CONTACT_COST)
      setShowPaymentModal(false)
      toast.success('Contact details unlocked!')
    } catch (error) {
      console.error('Error purchasing contact:', error)
      toast.error('Failed to purchase contact access')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleStartConversation = async () => {
    if (!user) {
      toast.error('Please sign in to message tutors')
      return
    }

    if (!contactPurchased) {
      handleContactPurchase()
      return
    }

    try {
      const result = await startConversation(
        user.id, 
        tutor.user_id, 
        null, 
        "Hi! I'm interested in your tutoring services."
      )
      
      if (result.error) {
        toast.error('Failed to start conversation')
        return
      }
      
      // Navigate to messages page - you may need to adjust this route
      router.push('/messages')
      toast.success('Conversation started!')
    } catch (error) {
      console.error('Error starting conversation:', error)
      toast.error('Something went wrong')
    }
  }

  const handleBookSession = () => {
    if (!user) {
      toast.error('Please sign in to book sessions')
      return
    }
    
    // Redirect to booking page with tutor ID
    router.push(`/book-session?tutorId=${tutor.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tutor not found</h1>
          <p className="text-gray-600 mb-6">The tutor profile you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/find-tutors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tutor Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center lg:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={tutor.avatar_url} alt={tutor.name} />
                    <AvatarFallback className="text-2xl">
                      {tutor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {tutor.verified && (
                    <Badge className="bg-green-100 text-green-800 mb-2">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Tutor
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tutor.rating || 'New'}</span>
                    <span className="text-gray-600">
                      ({tutor.total_reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        {tutor.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{tutor.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Responds in {tutor.response_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{tutor.experience_years} years experience</span>
                        </div>
                      </div>
                      
                      {tutor.bio && (
                        <p className="text-gray-700 mb-4 max-w-2xl">{tutor.bio}</p>
                      )}
                      
                      {/* Subjects */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tutor.subjects && tutor.subjects.map(subject => (
                          <Badge key={subject.id} variant="secondary" className="text-sm">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Languages */}
                      {tutor.languages && tutor.languages.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <Languages className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">
                            Speaks: {tutor.languages.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pricing and Actions */}
                    <div className="lg:text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${tutor.hourly_rate}
                        <span className="text-lg font-normal text-gray-600">/hour</span>
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-800 mb-4">
                        {tutor.availability_status}
                      </Badge>
                      
                      <div className="space-y-3">
                        <Button 
                          size="lg" 
                          className="w-full lg:w-auto"
                          onClick={handleBookSession}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Session
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full lg:w-auto"
                          onClick={handleStartConversation}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {contactPurchased ? 'Send Message' : `Message (${CONTACT_COST} coins)`}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Teaching Style */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Teaching Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {tutor.teaching_style || 'No teaching style information available.'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Specializations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Specializations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tutor.specializations && tutor.specializations.length > 0 ? (
                        <div className="space-y-2">
                          {tutor.specializations.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>{spec}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No specializations listed.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Meeting Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Meeting Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {tutor.preferred_meeting_types && tutor.preferred_meeting_types.includes('online') && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span>Online sessions</span>
                          </div>
                        )}
                        {tutor.preferred_meeting_types && tutor.preferred_meeting_types.includes('in_person') && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <span>In-person sessions</span>
                          </div>
                        )}
                        {tutor.preferred_meeting_types && tutor.preferred_meeting_types.includes('travel') && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span>Can travel to you</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Sessions:</span>
                          <span className="font-semibold">{tutor.total_sessions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-semibold">{Number(tutor.success_rate).toFixed(2) || 'N/A'}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Rate:</span>
                          <span className="font-semibold">{Number(tutor.response_rate).toFixed(2) || 'N/A'}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Instant Booking:</span>
                          <span className="font-semibold">
                            {tutor.instant_booking ? (
                              <CheckCircle className="w-4 h-4 text-green-600 inline" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400 inline" />
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <CardTitle>Education & Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Education</h3>
                        <p className="text-gray-700">
                          {tutor.education || 'No education information provided.'}
                        </p>
                      </div>

                      <Separator />

                      {/* Certifications */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                        {tutor.certifications && tutor.certifications.length > 0 ? (
                          <div className="grid gap-2">
                            {tutor.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-600" />
                                <span>{cert}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No certifications listed.</p>
                        )}
                      </div>

                      <Separator />

                      {/* Experience */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Experience</h3>
                        <p className="text-gray-700">
                          <strong>{tutor.experience_years} years</strong> of tutoring experience
                        </p>
                        {tutor.total_sessions > 0 && (
                          <p className="text-gray-600 mt-2">
                            Has completed {tutor.total_sessions} tutoring sessions on our platform
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tutor.total_reviews > 0 ? (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          {tutor.rating} out of 5 stars
                        </h3>
                        <p className="text-gray-600">
                          Based on {tutor.total_reviews} student reviews
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                          Detailed reviews will be shown here once available
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-500">
                          This tutor is new to our platform. Be the first to leave a review!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Current Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {tutor.availability_status}
                        </Badge>
                      </div>

                      {tutor.minimum_session_duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Minimum Session:</span>
                          <span>{tutor.minimum_session_duration} minutes</span>
                        </div>
                      )}

                      {tutor.travel_radius_km && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Travel Radius:</span>
                          <span>{tutor.travel_radius_km} km</span>
                        </div>
                      )}

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Book a Session</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          To see this tutor's detailed availability and book a session, click the button below.
                        </p>
                        <Button onClick={handleBookSession} className="w-full">
                          View Available Times
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contactPurchased ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800 mb-2">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Contact Access Unlocked</span>
                          </div>
                          <p className="text-green-700 text-sm">
                            You can now view contact details and message this tutor directly.
                          </p>
                        </div>

                        {/* Contact Details - Only shown after payment */}
                        <div className="space-y-3">
                          {tutor.email && (
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-600" />
                              <span>{tutor.email}</span>
                            </div>
                          )}
                          {tutor.phone_number && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-600" />
                              <span>{tutor.phone_number}</span>
                            </div>
                          )}
                        </div>

                        <Button 
                          onClick={handleStartConversation}
                          className="w-full"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Conversation
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Contact Details Protected
                        </h3>
                        <p className="text-gray-600 mb-4">
                          To protect tutors from spam, contact information requires a small payment of {CONTACT_COST} coins.
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 mb-6">
                          <Coins className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium">Your Balance: {userCoins} coins</span>
                        </div>

                        <Button 
                          onClick={handleContactPurchase}
                          disabled={!user}
                          className="w-full"
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          Unlock Contact ({CONTACT_COST} coins)
                        </Button>

                        {!user && (
                          <p className="text-sm text-gray-500 mt-3">
                            Please sign in to contact tutors
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Contact Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              You're about to spend <strong>{CONTACT_COST} coins</strong> to unlock contact details for {tutor.name}.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>Current Balance:</span>
              <span className="font-semibold">{userCoins} coins</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span>After Purchase:</span>
              <span className="font-semibold">{userCoins - CONTACT_COST} coins</span>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmContactPurchase}
                disabled={processingPayment}
                className="flex-1"
              >
                {processingPayment ? 'Processing...' : `Pay ${CONTACT_COST} Coins`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Insufficient Coins Modal */}
      <Dialog open={showInsufficientCoinsModal} onOpenChange={setShowInsufficientCoinsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Insufficient Coins
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              You need <strong>{CONTACT_COST} coins</strong> to unlock contact details, but you only have <strong>{userCoins} coins</strong>.
            </p>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Alternative Options:</h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Purchase more coins from your wallet</li>
                <li>• Create a tutor request instead (free)</li>
                <li>• Browse other tutors who might be a better fit</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/find-tutors')}
                className="flex-1"
              >
                Browse Other Tutors
              </Button>
              <Button 
                onClick={() => router.push('/request-tutor')}
                className="flex-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                Create Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
