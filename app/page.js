"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, BookOpen, Users, Star, ArrowRight, Award, Sigma, Radiation, FlaskConical, Book, Computer, Fingerprint, Shield, TrendingUp, Clock, CheckCircle2, Zap, Target, Globe, GraduationCap, MapPin, Play, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/contexts/UserContext"
import ProfileDashboard from "@/components/ProfileDashboard"
import ThemedHero from "@/components/ThemedHero"
import { getTopTutorsByRole } from "@/lib/supabaseAPI"

// Sample data
const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "English", "History", "Geography", "Economics", "Psychology", "Art", "Music"
]

const locations = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
]

const topTutors = [
  {
    id: 1,
    name: "Shireen Sungkar",
    avatar: "/placeholder.svg?height=80&width=80",
    subject: "Algebra",
    rating: 4.9,
    reviews: 127,
    experience: "20+ h taught",
    location: "Germany",
    hourlyRate: 75,
    badges: ["Expert in Algebra", "Top Rated"],
    totalSessions: 500,
    responseTime: "Free video chat",
    specialization: "Calculus, Statistics, Linear Algebra",
    bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    feedbackRate: "92% Positive Feedback"
  },
  {
    id: 2,
    name: "Tony Lee",
    avatar: "/placeholder.svg?height=80&width=80",
    subject: "Cooking",
    rating: 4.8,
    reviews: 89,
    experience: "Expert in Cooking",
    location: "India",
    hourlyRate: 85,
    badges: ["Master Chef", "Indian Cuisine"],
    totalSessions: 300,
    responseTime: "Free video chat",
    specialization: "Indian Cuisine, Vegetarian Cooking",
    bgColor: "bg-gradient-to-br from-blue-400 to-blue-500",
    feedbackRate: "95% Positive Feedback"
  }
]

const popularCategories = [
  {
    name: "Science & Engineering",
    icon: <Radiation size="2em" className="text-green-400" />,
    mentors: "2.8k",
    color: "border-green-500/20 bg-green-500/5 hover:border-green-500/40",
    description: "Physics, Chemistry, Engineering, Mathematics"
  },
  {
    name: "Programming & Tech",
    icon: <Computer size="2em" className="text-blue-400" />,
    mentors: "3.2k",
    color: "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40",
    description: "Software Development, Data Science, AI/ML"
  },
  {
    name: "Business & Career",
    icon: <TrendingUp size="2em" className="text-purple-400" />,
    mentors: "1.9k",
    color: "border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40",
    description: "Entrepreneurship, Leadership, Career Guidance"
  },
  {
    name: "Creative & Design",
    icon: <Target size="2em" className="text-orange-400" />,
    mentors: "1.5k",
    color: "border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40",
    description: "Graphic Design, UI/UX, Creative Writing"
  },
]

const featuredMentors = [
  {
    name: "Dr. Sarah Chen",
    expertise: "Machine Learning & Data Science",
    rating: 4.9,
    reviews: 127,
    experience: "8+ years at Google",
    image: "/placeholder.svg?height=80&width=80",
    badges: ["PhD", "Google Alumni", "Top Mentor"],
    sessions: "500+ sessions",
  },
  {
    name: "Marcus Rodriguez",
    expertise: "Full-Stack Development",
    rating: 4.8,
    reviews: 89,
    experience: "Senior Engineer at Meta",
    image: "/placeholder.svg?height=80&width=80",
    badges: ["Meta Engineer", "React Expert", "Mentor+"],
    sessions: "300+ sessions",
  },
  {
    name: "Emily Thompson",
    expertise: "Product Management",
    rating: 4.9,
    reviews: 156,
    experience: "VP Product at Spotify",
    image: "/placeholder.svg?height=80&width=80",
    badges: ["VP Product", "Spotify", "Strategy Expert"],
    sessions: "400+ sessions",
  },
]

const successStories = [
  {
    name: "Alex Kumar",
    role: "Software Engineer",
    company: "Microsoft",
    text: "My mentor helped me transition from finance to tech. Within 6 months, I landed my dream job at Microsoft!",
    rating: 5,
    outcome: "Career Change Success"
  },
  {
    name: "Maria Santos",
    role: "Data Scientist",
    company: "Netflix",
    text: "The personalized guidance and real-world projects helped me master ML. Now I'm building recommendation systems at Netflix.",
    rating: 5,
    outcome: "Skill Mastery"
  },
  {
    name: "David Park",
    role: "Startup Founder",
    company: "TechStart Inc.",
    text: "My business mentor guided me through fundraising and scaling. We just closed our Series A round!",
    rating: 5,
    outcome: "Business Growth"
  },
]

const platformStats = [
  { number: "28k+", label: "Verified Mentors", icon: Users, color: "text-green-400" },
  { number: "290k+", label: "Sessions Completed", icon: Award, color: "text-blue-400" },
  { number: "50+", label: "Industries", icon: Globe, color: "text-purple-400" },
  { number: "4.9/5", label: "Average Rating", icon: Star, color: "text-orange-400" },
]

const trustSignals = [
  { metric: "98%", label: "Success Rate", icon: TrendingUp },
  { metric: "24/7", label: "Support", icon: Clock },
  { metric: "100%", label: "Secure", icon: Shield },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [topTutors, setTopTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, profile, loading: userLoading } = useUser()

  // Fetch top tutors from database
  useEffect(() => {
    const fetchTopTutors = async () => {
      try {
        setLoading(true)
        const { data, error } = await getTopTutorsByRole(6) // Get top 6 tutors
        if (error) {
          console.error('Error fetching tutors:', error)
          // Fallback to sample data if database fetch fails
          setTopTutors([
            {
              id: 1,
              name: "Shireen Sungkar",
              avatar: "/placeholder.svg?height=80&width=80",
              subject: "Algebra",
              rating: 4.9,
              reviews: 127,
              experience: "20+ h taught",
              location: "Germany",
              hourlyRate: 75,
              badges: ["Expert in Algebra", "Top Rated"],
              totalSessions: 500,
              responseTime: "Free video chat",
              specialization: "Calculus, Statistics, Linear Algebra",
              bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
              feedbackRate: "92% Positive Feedback"
            },
            {
              id: 2,
              name: "Tony Lee",
              avatar: "/placeholder.svg?height=80&width=80",
              subject: "Cooking",
              rating: 4.8,
              reviews: 89,
              experience: "Expert in Cooking",
              location: "India",
              hourlyRate: 85,
              badges: ["Master Chef", "Indian Cuisine"],
              totalSessions: 300,
              responseTime: "Free video chat",
              specialization: "Indian Cuisine, Vegetarian Cooking",
              bgColor: "bg-gradient-to-br from-blue-400 to-blue-500",
              feedbackRate: "95% Positive Feedback"
            }
          ])
        } else {
          setTopTutors(data || [])
        }
      } catch (err) {
        console.error('Error in fetchTopTutors:', err)
        // Use fallback data
        setTopTutors([])
      } finally {
        setLoading(false)
      }
    }

    fetchTopTutors()
  }, [])

  const searchTutor = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('query', searchQuery)
    if (selectedSubject) params.append('subject', selectedSubject)
    if (selectedLocation) params.append('location', selectedLocation)
    router.replace(`/find-tutors?${params.toString()}`)
  }

  // Show profile dashboard if user is authenticated and profile is loaded
  if (user && !userLoading) {
    return <ProfileDashboard />
  }

  // Show regular homepage for non-authenticated users or while loading
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <ThemedHero variant="light">
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="">
              <div>
                {/* Title with overlapping avatars */}
                <div className="relative">
                  <div className="flex items-start gap-2 mb-4">
                    {/* Overlapping profile avatars */}
                    <div className="flex -space-x-3 mr-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 border-2 border-white relative">
                          <div className="w-full h-full rounded-full bg-gray-300"></div>
                        </div>
                      ))}
                      {/* Playful arrow */}
                      <div className="ml-2 mt-2">
                        <ArrowRight className="w-5 h-5 text-green-400 transform rotate-12" />
                      </div>
                    </div>
                  </div>

                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    <span className="text-black">Find your</span>{" "}
                    <span className="text-black font-bold text-5xl lg:text-7xl">Perfect guru</span>
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg mt-4">
                    We help you find the perfect guru. It's completely FREE
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-8 py-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">12k+</div>
                    <div className="text-sm text-gray-600">Tutors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">108k+</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">210+</div>
                    <div className="text-sm text-gray-600">Subjects</div>
                  </div>
                </div>

                {/* Highlight Badge */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-700 fill-current" />
                  </div>
                  <span className="text-gray-800">
                    Over one million students have given a 5 star review to their tutor →
                  </span>
                </div>
              </div>

              {/* Enhanced Search Bar */}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/request-tutor">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full border-0 shadow-xl shadow-green-500/20">
                    Request a Tutor
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/find-tutors">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 rounded-full">
                    Browse Tutors
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - How it works video + Top tutors */}
            <div className="relative space-y-6">
              {/* How It Works Video Circle */}
              <div className="relative mx-auto w-fit">
                <div className="w-48 h-48 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center cursor-pointer group hover:scale-105 transition-all duration-300 shadow-2xl">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 text-green-500 ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse"></div>
                <div className="text-center mt-4">
                  <p className="text-lg font-semibold text-gray-800">How it works</p>
                  <p className="text-sm text-gray-600">Watch our 2-minute guide</p>
                </div>
              </div>

              {/* Top Tutors Cards */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 text-center">Top Rated Tutors</h3>
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton
                    <div className="space-y-4">
                      {[1, 2].map((index) => (
                        <Card key={index} className="overflow-hidden border-0 shadow-lg">
                          <div className="bg-gray-200 animate-pulse p-6">
                            <div className="flex justify-center mb-4">
                              <div className="h-20 w-20 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="text-center space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                              <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                            </div>
                          </div>
                          <CardContent className="p-4 bg-white">
                            <div className="space-y-3">
                              <div className="h-3 bg-gray-200 rounded"></div>
                              <div className="h-8 bg-gray-200 rounded"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    topTutors.slice(0, 2).map((tutor) => (
                      <Card key={tutor.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className={`${tutor.bgColor} p-6 relative`}>
                          {/* Heart icon */}
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">♥</span>
                              </div>
                            </div>
                          </div>

                          {/* Tutor Image */}
                          <div className="flex justify-center mb-4">
                            <div className="relative">
                              <Avatar className="h-20 w-20 border-4 border-white/50">
                                <AvatarImage src={tutor.avatar} alt={tutor.name} />
                                <AvatarFallback className="bg-white text-gray-800 font-bold text-lg">
                                  {tutor.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              {/* Verification badge */}
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Tutor Info */}
                          <div className="text-center text-white">
                            <h4 className="font-bold text-lg mb-1">{tutor.name}</h4>
                            <div className="flex items-center justify-center gap-1 mb-2">
                              <Award className="w-4 h-4" />
                              <span className="text-sm font-medium">{tutor.experience}</span>
                            </div>
                            <p className="text-white/90 text-sm mb-3">{tutor.responseTime}</p>
                          </div>
                        </div>

                        {/* Card Bottom */}
                        <CardContent className="p-4 bg-white">
                          <div className="space-y-3">
                            {/* Feedback Badge */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-700">{tutor.feedbackRate}</span>
                              </div>
                            </div>

                            {/* Subject Badge */}
                            <div className="flex items-center justify-center">
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-3 py-1">
                                Expert in {tutor.subject}
                              </Badge>
                            </div>

                            {/* Location with Country Flag */}
                            <div className="flex items-center justify-center gap-1 text-gray-600">
                              <div className="w-4 h-3 rounded-sm overflow-hidden">
                                {tutor.country === "Germany" && (
                                  <div className="flex h-full">
                                    <div className="flex-1 bg-black"></div>
                                    <div className="flex-1 bg-red-500"></div>
                                    <div className="flex-1 bg-yellow-400"></div>
                                  </div>
                                )}
                                {tutor.country === "India" && (
                                  <div className="flex flex-col h-full">
                                    <div className="flex-1 bg-orange-500"></div>
                                    <div className="flex-1 bg-white border-t border-b border-gray-300"></div>
                                    <div className="flex-1 bg-green-600"></div>
                                  </div>
                                )}
                                {(tutor.country !== "Germany" && tutor.country !== "India") && (
                                  <div className="w-full h-full bg-gray-300"></div>
                                )}
                              </div>
                              <span className="text-sm">{tutor.location}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium text-gray-900">{tutor.rating}</span>
                              <span className="text-gray-600 text-sm">({tutor.reviews} reviews)</span>
                            </div>

                            {/* Contact Button */}
                            <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200">
                              Contact Tutor
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </ThemedHero>
      {/* Remove the absolute positioned video circle since it's now in the right column */}
      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Subjects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find expert tutors across all subjects and skill levels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <Link key={index} href="/find-tutors">
                <Card className={`group cursor-pointer border-2 transition-all duration-300 hover:-translate-y-2 ${category.color} bg-white/50 backdrop-blur-sm hover:bg-white`}>
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 group-hover:bg-green-100 group-hover:text-green-700 group-hover:border-green-200 transition-all">
                      {category.mentors} tutors
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Top Tutors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from verified, experienced tutors with proven track records of success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredMentors.map((mentor, index) => (
              <Card key={index} className="group hover:scale-105 transition-all duration-300 bg-white border-gray-200 hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Avatar className="h-20 w-20 mr-4 ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all">
                      <AvatarImage src={mentor.image || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-600 font-semibold text-lg">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">{mentor.name}</h3>
                      <p className="text-gray-600 text-sm">{mentor.expertise}</p>
                      <p className="text-gray-500 text-xs mt-1">{mentor.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium text-gray-900">{mentor.rating}</span>
                      <span className="text-gray-600 text-sm ml-1">({mentor.reviews} reviews)</span>
                    </div>
                    <span className="text-sm text-gray-600">{mentor.sessions}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {mentor.badges.map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white border-0 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/find-tutors">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50">
                View All Tutors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold group-hover:scale-110 transition-all duration-300 shadow-xl shadow-green-500/20">
                  1
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">Find a Tutor</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through verified tutors and find your perfect match based on subject, location, and budget.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold group-hover:scale-110 transition-all duration-300 shadow-xl shadow-green-500/20">
                  2
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">Book a Session</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose a convenient time and book your first session. All payments are secure and protected.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold group-hover:scale-110 transition-all duration-300 shadow-xl shadow-green-500/20">
                  3
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">Start Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with your tutor and start your personalized learning journey to achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our students have achieved their goals with personalized tutoring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="bg-white hover:bg-gray-50 transition-all duration-300 border-gray-200 hover:border-green-300 hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{story.text}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{story.name}</p>
                        <p className="text-sm text-gray-600">
                          {story.role} at {story.company}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {story.outcome}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customer Protection Card */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Secure & Protected</h3>
                <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  All payments are secured and protected. We track every transaction to ensure your safety and satisfaction.
                </p>
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full border-0 shadow-lg shadow-green-500/20">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - FAQ Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Get answers to common questions about our tutoring platform and services.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 text-left p-6 h-auto"
                >
                  <span>VIEW POPULAR SUBJECTS</span>
                </Button>

                <Link href="/find-tutors">
                  <Button
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white border-0 p-6 h-auto shadow-lg shadow-green-500/20"
                  >
                    <span className="mr-2">FIND TUTORS NOW</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - FAQ Items */}
            <div className="space-y-4">
              {[
                "1. How do I find the right tutor for my needs?",
                "2. What subjects and skills are available?",
                "3. How does the booking and payment system work?",
                "4. Can I reschedule or cancel sessions?",
                "5. What if I'm not satisfied with my tutor?"
              ].map((question, index) => (
                <Card key={index} className="bg-white border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 group-hover:text-green-600 transition-colors">{question}</span>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to start learning?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have achieved their goals with personalized tutoring and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/request-tutor">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-lg rounded-full border-0 shadow-xl shadow-green-500/20">
                  <span className="mr-2">GET STARTED</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/become-tutor">
                <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-500 hover:text-green-600 px-12 py-6 text-lg rounded-full">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">TutorConnect</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                Connecting students with expert tutors for personalized learning experiences.
              </p>
              <div className="text-sm space-y-1">
                <p className="text-white font-semibold">123 Education Street, Learning City,</p>
                <p>State 12345, United States</p>
                <p className="mt-4">+1 (555) 123-4567</p>
                <p>hello@tutorconnect.com</p>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="font-semibold mb-6 text-white">For Students</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/find-tutors" className="hover:text-green-400 transition-colors">
                    Find Tutors
                  </Link>
                </li>
                <li>
                  <Link href="/subjects" className="hover:text-green-400 transition-colors">
                    Browse Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-green-400 transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-green-400 transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Tutors */}
            <div>
              <h3 className="font-semibold mb-6 text-white">For Tutors</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/become-tutor" className="hover:text-green-400 transition-colors">
                    Become a Tutor
                  </Link>
                </li>
                <li>
                  <Link href="/tutor-resources" className="hover:text-green-400 transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/tutor-support" className="hover:text-green-400 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="hover:text-green-400 transition-colors">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="hover:text-green-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-green-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-green-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-green-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2025 TutorConnect. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-400 hover:border-green-500 hover:text-green-400">
                USD ($)
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-400 hover:border-green-500 hover:text-green-400">
                🌍 English
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
