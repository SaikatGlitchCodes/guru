"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ThemedHero from "@/components/ThemedHero"
import { getOpenRequests } from "@/lib/supabaseAPI"
import { 
  Briefcase, 
  Users, 
  Clock, 
  Target,
  CheckCircle,
  ArrowRight,
  BookOpen,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  AlertCircle,
  MapPin,
  DollarSign,
  Plus
} from "lucide-react"
import Link from "next/link"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

const JobSupportPage = () => {
  const { user, profile } = useUser()
  const [jobSupportRequests, setJobSupportRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRequests: 0,
    averageRate: 85,
    successRate: 89
  })

  useEffect(() => {
    const fetchJobSupportRequests = async () => {
      try {
        setLoading(true)
        
        // Fetch job support requests specifically
        const result = await getOpenRequests({
          requestTypes: ['Job Support'],
          sortBy: 'newest',
          limit: 2
        })

        if (result.data) {
          setJobSupportRequests(result.data)
          setStats(prev => ({
            ...prev,
            totalRequests: result.total || result.data.length
          }))
        }
      } catch (error) {
        console.error('Error fetching job support requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobSupportRequests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHero>
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Job Support & Career Mentoring</h1>
            <p className="text-xl text-gray-300 mb-6">
              Help professionals advance their careers through personalized mentoring
            </p>
            
            
          </div>

          {/* Quick Stats */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Briefcase className="w-8 h-8 mx-auto mb-3 text-blue-300" />
              <div className="text-2xl font-bold text-white">{stats.totalRequests}</div>
              <div className="text-blue-200 text-sm">Active Job Support Requests</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-300" />
              <div className="text-2xl font-bold text-white">${stats.averageRate}</div>
              <div className="text-green-200 text-sm">Average Hourly Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-purple-300" />
              <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
              <div className="text-purple-200 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </ThemedHero>

      <div className="container mx-auto px-4 py-8">
        {/* What is Job Support */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              What is Job Support?
            </CardTitle>
            <CardDescription>
              Job Support is specialized mentoring for career advancement and interview preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  What You'll Help With:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Technical interview preparation</li>
                  <li>• System design interviews</li>
                  <li>• Career transition guidance</li>
                  <li>• Resume and LinkedIn optimization</li>
                  <li>• Salary negotiation strategies</li>
                  <li>• Industry-specific knowledge</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Why Tutors Choose Job Support:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Higher hourly rates (typically ₹60-150/hr)</li>
                  <li>• Professional networking opportunities</li>
                  <li>• Flexible session scheduling</li>
                  <li>• Help others advance their careers</li>
                  <li>• Showcase your industry expertise</li>
                  <li>• Build long-term mentoring relationships</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Requirements for Job Support</AlertTitle>
          <AlertDescription className="text-blue-700">
            To provide job support, you should have: 3+ years of industry experience, expertise in specific technologies/domains, 
            and experience with hiring processes or interviewing candidates.
          </AlertDescription>
        </Alert>

        {/* Current Job Support Requests */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Current Job Support Requests</h2>
          <div className="flex gap-3">
            <Link href="/request-tutor">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Request Tutor
              </Button>
            </Link>
            <Link href="/tutor-jobs?filter=job-support">
              <Button>
                View All Job Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
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
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobSupportRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3">
                        {request.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={request.urgency === "High" || request.urgency === "urgent" ? "destructive" : "secondary"}
                      className="ml-2"
                    >
                      {request.urgency || 'Flexible'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Budget:</span>
                      <span className="font-semibold text-green-600">
                        {request.price_currency_symbol || '₹'}{request.price_amount}/hr
                      </span>
                    </div>
                    
                    {/* Location */}
                    {(request.address?.city || request.address?.country) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {request.address?.city}, {request.address?.country}
                        </span>
                      </div>
                    )}
                    
                    {/* Subjects/Skills */}
                    {request.subjects && request.subjects.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Required Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {request.subjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {subject.name}
                            </Badge>
                          ))}
                          {request.subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{request.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Level:</span>
                        <p className="font-medium">{request.level || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Meeting:</span>
                        <div className="flex gap-1 mt-1">
                          {request.online_meeting && (
                            <Badge variant="outline" className="text-xs">Online</Badge>
                          )}
                          {request.offline_meeting && (
                            <Badge variant="outline" className="text-xs">In-person</Badge>
                          )}
                          {!request.online_meeting && !request.offline_meeting && (
                            <span className="text-xs text-gray-500">Flexible</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && jobSupportRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Support Requests</h3>
              <p className="text-gray-600 mb-6">
                There are currently no active job support requests. Create a request or browse general tutoring opportunities.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/request-tutor">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Request Job Support Tutor
                  </Button>
                </Link>
                <Link href="/tutor-jobs?filter=job-support">
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse All Job Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              Need Help Getting Started?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-sm text-gray-600">Get help via email within 24 hours</p>
                <Button variant="outline" className="mt-3" size="sm">
                  Contact Support
                </Button>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Phone Consultation</h4>
                <p className="text-sm text-gray-600">Schedule a call to discuss opportunities</p>
                <Button variant="outline" className="mt-3" size="sm">
                  Schedule Call
                </Button>
              </div>
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Tutor Resources</h4>
                <p className="text-sm text-gray-600">Access guides and best practices</p>
                <Button variant="outline" className="mt-3" size="sm">
                  View Resources
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobSupportPage;
