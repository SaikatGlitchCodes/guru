"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Star, MapPin, Clock, BookOpen, Award, Users, Globe, MessageCircle, 
  Phone, Mail, Calendar, DollarSign, Shield, CheckCircle, X, 
  GraduationCap, Trophy, Target, Zap, Heart
} from "lucide-react"
import { getTutorProfileEnhanced, startConversation, getUserProfile, deductCoins } from '@/lib/supabaseAPI'
import { useUser } from "@/contexts/UserContext"
import ThemedHero from "@/components/ThemedHero"

export default function TutorProfilePage() {
  const { user } = useUser()
  const router = useRouter()
  const params = useParams()
  const tutorId = params.id
  
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contacting, setContacting] = useState(false)
  const [hasAccessToContact, setHasAccessToContact] = useState(false)

  // Contact pricing based on tutor rating and experience
  const calculateContactCost = (tutorData) => {
    if (!tutorData) return 0
    
    let baseCost = 5 // Base cost in coins
    
    // Add cost based on rating
    if (tutorData.rating >= 4.8) baseCost += 10
    else if (tutorData.rating >= 4.5) baseCost += 7
    else if (tutorData.rating >= 4.0) baseCost += 5
    else if (tutorData.rating >= 3.5) baseCost += 3
    
    // Add cost based on experience
    if (tutorData.experience_years >= 10) baseCost += 10
    else if (tutorData.experience_years >= 5) baseCost += 5
    else if (tutorData.experience_years >= 2) baseCost += 3
    
    // Add cost for verified tutors
    if (tutorData.verified) baseCost += 5
    
    // Add cost for high demand tutors (many reviews)
    if (tutorData.total_reviews >= 100) baseCost += 8
    else if (tutorData.total_reviews >= 50) baseCost += 5
    else if (tutorData.total_reviews >= 20) baseCost += 3
    
    return Math.min(baseCost, 50) // Cap at 50 coins
  }

  useEffect(() => {
    const loadTutorProfile = async () => {
      setLoading(true)
      try {
        const result = await getTutorProfileEnhanced(tutorId)
        if (!result.error && result.data) {
          setTutor(result.data)
          
          // Check if user already has access to contact info
          if (user?.id) {
            // TODO: Check if user has already paid for this tutor's contact info
            // This would require a database query to check payment history
            setHasAccessToContact(false) // For now, always require payment
          }
        } else {
          setError(result.error || 'Tutor not found')
        }
      } catch (error) {
        console.error('Error loading tutor profile:', error)
        setError('Failed to load tutor profile')
      } finally {
        setLoading(false)
      }
    }

    if (tutorId) {
      loadTutorProfile()
    }
  }, [tutorId, user])

  const handleContactTutor = async () => {
    if (!user?.id) {
      alert("Please sign in to contact tutors")
      return
    }
    
    if (!hasAccessToContact) {
      setShowContactModal(true)
      return
    }

    // If already has access, start conversation directly
    try {
      const result = await startConversation(
        user.id, 
        tutor.user_id, 
        null,
        `Hi ${tutor.name}, I'm interested in your tutoring services. I'd love to discuss my learning needs with you. Are you available for a consultation?`
      )
      
      if (!result.error) {
        router.push(`/messages/${tutor.user_id}`)
      } else {
        alert('Failed to start conversation. Please try again.')
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Failed to contact tutor. Please try again.')
    }
  }

  const handlePayToContact = async () => {
    if (!user?.id || !tutor) return
    
    setContacting(true)
    
    try {
      const contactCost = calculateContactCost(tutor)
      
      // Check if user has enough coins
      const userProfile = await getUserProfile(user.id)
      if (!userProfile.data || userProfile.data.coin_balance < contactCost) {
        alert(`Insufficient coins. You need ${contactCost} coins to contact this tutor. Please purchase more coins.`)
        setContacting(false)
        return
      }
      
      // Deduct coins and grant access
      const deductResult = await deductCoins(user.id, contactCost, `Contact tutor: ${tutor.name}`)
      
      if (deductResult.error) {
        alert('Failed to process payment. Please try again.')
        setContacting(false)
        return
      }
      
      // Start conversation
      const conversationResult = await startConversation(
        user.id, 
        tutor.user_id, 
        null,
        `Hi ${tutor.name}, I'm interested in your tutoring services. I'd love to discuss my learning needs with you. Are you available for a consultation?`
      )
      
      if (!conversationResult.error) {
        setHasAccessToContact(true)
        setShowContactModal(false)
        router.push(`/messages/${tutor.user_id}`)
      } else {
        alert('Failed to start conversation. Please contact support.')
      }
      
    } catch (error) {
      console.error('Error processing contact payment:', error)
      alert('Failed to process payment. Please try again.')
    } finally {
      setContacting(false)
    }
  }

  const ContactModal = () => {
    if (!tutor) return null
    
    const contactCost = calculateContactCost(tutor)
    
    return (
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {tutor.name}</DialogTitle>
            <DialogDescription>
              To maintain quality connections and prevent spam, there's a small fee to contact this tutor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Contact Fee</span>
                <span className="text-xl font-bold text-blue-600">{contactCost} coins</span>
              </div>
              <p className="text-sm text-gray-600">
                This fee is based on the tutor's rating ({tutor.rating}★), experience ({tutor.experience_years} years), and verification status.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">What you get:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Direct messaging with {tutor.name}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Access to contact information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Ability to schedule sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Lifetime access to this tutor's profile
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowContactModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayToContact}
                disabled={contacting}
                className="flex-1"
              >
                {contacting ? 'Processing...' : `Pay ${contactCost} coins`}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Your coins will only be deducted once you successfully connect with the tutor.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading tutor profile...</div>
        </div>
      </div>
    )
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutor Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/find-tutors')}>
            Browse Tutors
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ThemedHero variant="dark">
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Image and Basic Info */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={tutor.avatar_url} alt={tutor.name} />
                  <AvatarFallback className="text-2xl">
                    {tutor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{tutor.name}</h1>
                  {tutor.verified && (
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-6 mb-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{tutor.rating}</span>
                    <span>({tutor.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{tutor.response_time}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {tutor.subjects && tutor.subjects.slice(0, 4).map(subject => (
                    <Badge key={subject.id} variant="secondary" className="bg-white/20 text-white">
                      {subject.name}
                    </Badge>
                  ))}
                  {tutor.subjects && tutor.subjects.length > 4 && (
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      +{tutor.subjects.length - 4} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-white">
                    ${tutor.hourly_rate}
                    <span className="text-lg font-normal opacity-80">/hour</span>
                  </div>
                  <Badge className={`${tutor.availability_status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                    {tutor.availability_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemedHero>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    About {tutor.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
                </CardContent>
              </Card>

              {/* Education & Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Education</h4>
                    <p className="text-gray-700">{tutor.education}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Experience</h4>
                    <p className="text-gray-700">{tutor.experience_years} years of teaching experience</p>
                  </div>
                  {tutor.certifications && tutor.certifications.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {tutor.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              <Award className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Subjects & Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Subjects & Specializations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {tutor.subjects && tutor.subjects.map(subject => (
                      <div key={subject.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-1">{subject.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{subject.category}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Level: {subject.proficiency_level}</span>
                          <span className="text-gray-500">{subject.years_experience} years</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {tutor.specializations && tutor.specializations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary">
                            <Target className="w-3 h-3 mr-1" />
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teaching Style & Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Teaching Style & Languages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tutor.teaching_style && (
                    <div>
                      <h4 className="font-semibold mb-2">Teaching Approach</h4>
                      <p className="text-gray-700">{tutor.teaching_style}</p>
                    </div>
                  )}
                  
                  {tutor.languages && tutor.languages.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {tutor.languages.map((lang, index) => (
                            <Badge key={index} variant="outline">
                              <Globe className="w-3 h-3 mr-1" />
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Tutor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={handleContactTutor}
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {hasAccessToContact ? 'Send Message' : `Contact (${calculateContactCost(tutor)} coins)`}
                  </Button>
                  
                  {!hasAccessToContact && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Small fee applies to maintain quality connections
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Response Time</span>
                      <span className="font-medium">{tutor.response_time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium">{Math.round(tutor.success_rate * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Sessions</span>
                      <span className="font-medium">{tutor.total_sessions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tutor.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reviews</span>
                      <span className="font-semibold">{tutor.total_reviews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="font-semibold">{tutor.experience_years} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-semibold">{Math.round(tutor.response_rate * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-semibold text-lg">${tutor.hourly_rate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Min. Duration</span>
                    <span className="font-semibold">{tutor.minimum_session_duration}min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Meeting Types</span>
                    <div className="flex gap-1">
                      {tutor.preferred_meeting_types && tutor.preferred_meeting_types.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {tutor.instant_booking && (
                    <div className="bg-green-50 p-2 rounded text-center">
                      <span className="text-green-700 text-sm font-medium">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Instant Booking Available
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal />
    </div>
  )
}
