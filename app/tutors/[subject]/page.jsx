"use client"

import { useParams, notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Star, MapPin, Clock, Book, Users, Award, CheckCircle, ArrowRight, MessageCircle, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getOpenRequests } from '@/lib/supabaseAPI'

// Subject mapping for SEO-friendly URLs
const subjectMapping = {
  'mathematics': 'Mathematics',
  'physics': 'Physics', 
  'chemistry': 'Chemistry',
  'biology': 'Biology',
  'english': 'English',
  'computer-science': 'Computer Science',
  'programming': 'Programming',
  'python': 'Python',
  'javascript': 'JavaScript',
  'react': 'React',
  'nodejs': 'Node.js',
  'neet': 'NEET',
  'jee': 'JEE',
  'cbse': 'CBSE',
  'icse': 'ICSE',
}

const subjectDescriptions = {
  'mathematics': {
    title: 'Expert Mathematics Tutors Online',
    description: 'Find the best mathematics tutors for algebra, calculus, geometry, statistics, and more. Get personalized help from IIT/NIT graduates.',
    benefits: ['Algebra & Calculus', 'Geometry & Trigonometry', 'Statistics & Probability', 'Competitive Exam Prep'],
    examPrep: ['JEE Maths', 'NEET Maths', 'CBSE Boards', 'Olympiad Preparation']
  },
  'physics': {
    title: 'Top Physics Tutors for JEE & NEET',
    description: 'Master physics concepts with expert tutors. Mechanics, thermodynamics, electromagnetism, and modern physics made easy.',
    benefits: ['Classical Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics'],
    examPrep: ['JEE Physics', 'NEET Physics', 'Board Exams', 'Physics Olympiad']
  },
  'chemistry': {
    title: 'Best Chemistry Tutors Online',
    description: 'Learn organic, inorganic, and physical chemistry from experienced tutors. Perfect for JEE, NEET, and board exams.',
    benefits: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Lab Techniques'],
    examPrep: ['JEE Chemistry', 'NEET Chemistry', 'CBSE Chemistry', 'Competitive Exams']
  },
  'programming': {
    title: 'Learn Programming from Expert Developers',
    description: 'Master coding with industry professionals. Python, Java, C++, web development, and data structures.',
    benefits: ['Data Structures', 'Algorithms', 'Web Development', 'Mobile Apps'],
    examPrep: ['Coding Interviews', 'Competitive Programming', 'Project Development', 'Career Guidance']
  },
  // Add more subjects as needed
}

export default function SubjectTutorsPage() {
  const params = useParams()
  const subjectSlug = params.subject
  const subjectName = subjectMapping[subjectSlug]
  const subjectInfo = subjectDescriptions[subjectSlug]
  
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!subjectName) {
      notFound()
      return
    }
    
    fetchTutorsForSubject()
  }, [subjectName])

  const fetchTutorsForSubject = async () => {
    try {
      setLoading(true)
      const result = await getOpenRequests({
        subjects: [subjectName],
        limit: 20,
        sortBy: 'rating'
      })
      
      if (result.data) {
        // Extract unique tutors from requests
        const uniqueTutors = []
        const seenTutors = new Set()
        
        result.data.forEach(request => {
          if (request.user && !seenTutors.has(request.user.id)) {
            seenTutors.add(request.user.id)
            uniqueTutors.push({
              ...request.user,
              subject: subjectName,
              hourlyRate: request.hourly_rate || 500,
              experience: request.user.years_of_experience || 2,
              rating: request.user.rating || 4.5,
              totalReviews: request.user.total_reviews || 10,
              location: request.location || 'Online',
              availability: 'Available Now'
            })
          }
        })
        
        setTutors(uniqueTutors)
      }
    } catch (error) {
      console.error('Error fetching tutors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!subjectName || !subjectInfo) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${subjectInfo.title} - TopTutor`,
    "description": subjectInfo.description,
    "provider": {
      "@type": "Organization",
      "name": "TopTutor",
      "url": "https://toptutor.com"
    },
    "serviceType": "Online Tutoring",
    "areaServed": "India",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${subjectName} Tutoring Services`,
      "itemListElement": tutors.map((tutor, index) => ({
        "@type": "Offer",
        "name": `${subjectName} Tutoring by ${tutor.name}`,
        "description": `Expert ${subjectName} tutoring`,
        "price": tutor.hourlyRate,
        "priceCurrency": "INR",
        "seller": {
          "@type": "Person",
          "name": tutor.name
        }
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {subjectInfo.title}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                {subjectInfo.description}
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={`Search ${subjectName} tutors...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full rounded-full text-gray-900"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{tutors.length}+</div>
                  <div className="text-blue-200">Expert Tutors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.9</div>
                  <div className="text-blue-200">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-blue-200">Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-blue-200">Success Stories</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/request-tutor">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Post Free Request
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/find-tutors">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Browse All Tutors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Master {subjectName} with Expert Guidance
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {subjectInfo.benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{benefit}</h3>
                    <p className="text-sm text-gray-600">
                      Get expert help in {benefit.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Exam Preparation */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Exam Preparation Specialists
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjectInfo.examPrep.map((exam, index) => (
                  <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                    {exam}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tutors Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Top {subjectName} Tutors
            </h2>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map((tutor, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-16 w-16 mr-4">
                          <AvatarImage src={tutor.avatar_url} alt={tutor.name} />
                          <AvatarFallback>{tutor.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{tutor.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{tutor.rating}</span>
                            <span className="ml-1 text-sm text-gray-500">({tutor.totalReviews})</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Book className="h-4 w-4 mr-2" />
                          {tutor.experience} years experience
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {tutor.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {tutor.availability}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">₹{tutor.hourlyRate}</span>
                          <span className="text-sm text-gray-500">/hour</span>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/find-tutors">
                <Button size="lg" variant="outline">
                  View All {subjectName} Tutors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Excel in {subjectName}?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students who have improved their grades with our expert tutors
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/request-tutor">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/find-tutors">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Find Tutors Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
