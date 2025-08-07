"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, BookOpen, Users, Star, ArrowRight, Play, MessageSquare, Calendar, Award, Sigma, Radiation, FlaskConical, Book, Computer, Fingerprint, CheckCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/contexts/UserContext"
import ProfileDashboard from "@/components/ProfileDashboard"

// Sample data
const popularSubjects = [
  { name: "Mathematics", icon: <Sigma size="3em" className="mb-2 text-blue-400" />, students: "2.3k", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Physics", icon: <Radiation size="3em" className="mb-2 text-purple-400" />, students: "1.8k", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Chemistry", icon: <FlaskConical size="3em" className="mb-2 text-green-400" />, students: "1.5k", color: "bg-green-50 text-green-700 border-green-200" },
  { name: "English", icon: <Book size="3em" className="mb-2 text-orange-400" />, students: "2.1k", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "Computer Science", icon: <Computer size="3em" className="mb-2 text-indigo-400" />, students: "1.9k", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { name: "Biology", icon: <Fingerprint size="3em" className="mb-2 text-emerald-400" />, students: "1.4k", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
]

const featuredTutors = [
  {
    name: "Sarah Chen",
    subject: "Mathematics",
    rating: 4.9,
    reviews: 127,
    price: "$35/hr",
    image: "/placeholder.svg?height=60&width=60",
    badges: ["Top Rated", "Quick Response"],
    experience: "5+ years",
  },
  {
    name: "David Rodriguez",
    subject: "Physics",
    rating: 4.8,
    reviews: 89,
    price: "$40/hr",
    image: "/placeholder.svg?height=60&width=60",
    badges: ["PhD", "University Prof"],
    experience: "8+ years",
  },
  {
    name: "Emily Johnson",
    subject: "English",
    rating: 4.9,
    reviews: 156,
    price: "$30/hr",
    image: "/placeholder.svg?height=60&width=60",
    badges: ["Native Speaker", "IELTS Expert"],
    experience: "4+ years",
  },
]

const testimonials = [
  {
    name: "Alex Thompson",
    grade: "Grade 11",
    subject: "Calculus",
    text: "My tutor helped me improve from a C to an A+ in just 3 months. The personalized approach made all the difference!",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    grade: "University",
    subject: "Organic Chemistry",
    text: "Found the perfect tutor who explained complex concepts in simple terms. Highly recommend this platform!",
    rating: 5,
  },
  {
    name: "James Wilson",
    grade: "Grade 9",
    subject: "Algebra",
    text: "The tutors are patient and really care about your progress. My confidence in math has improved so much.",
    rating: 5,
  },
]

const stats = [
  { number: "10,000+", label: "Students Helped", icon: Users },
  { number: "500+", label: "Expert Tutors", icon: Award },
  { number: "50+", label: "Subjects Covered", icon: BookOpen },
  { number: "4.9/5", label: "Average Rating", icon: Star },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, profile, loading } = useUser()
  
  const searchTutor = () => {
    router.replace(`/find-tutors?query=${encodeURIComponent(searchQuery)}`)
  }

  // Show profile dashboard if user is authenticated and profile is loaded
  if (user && !loading) {
    return <ProfileDashboard />
  }

  // Show regular homepage for non-authenticated users or while loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  🎓 #1 Tutoring Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your Perfect
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {" "}Tutor
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with expert tutors for personalized learning experiences. Get help with academics, 
                  job preparation, and skill development from verified professionals.
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="What subject do you need help with?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-32 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-primary shadow-lg"
                  />
                  <Button
                    onClick={searchTutor}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 py-2 flex items-center"
                  >
                    Find Tutors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/request-tutor">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                    Request a Tutor
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/find-tutors">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
                    Browse Tutors
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">10,000+ Students</div>
                    <div>Trust our platform</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">4.9/5 Rating</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quick Stats</h3>
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MentorHub?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect students with the best tutors through our innovative platform designed for success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Expert Tutors</h3>
                <p className="text-gray-600">
                  All our tutors are verified professionals with proven track records and excellent ratings.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Personalized Learning</h3>
                <p className="text-gray-600">
                  Get customized learning plans tailored to your specific needs and learning style.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
                <p className="text-gray-600">
                  Safe and secure environment with verified profiles and protected payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Subjects</h2>
            <p className="text-xl text-gray-600">Find expert tutors in these high-demand subjects</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSubjects.map((subject, index) => (
              <Link key={index} href="/find-tutors">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center flex flex-col items-center">
                    {subject.icon}
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {subject.name}
                    </h3>
                    <Badge variant="secondary" className={`${subject.color} group-hover:scale-105 transition-transform`}>
                      {subject.students} students
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Top Tutors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from experienced educators who are passionate about helping students succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTutors.map((tutor, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                      <AvatarImage src={tutor.image || "/placeholder.svg"} alt={tutor.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {tutor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">{tutor.name}</h3>
                      <p className="text-gray-600">{tutor.subject}</p>
                      <p className="text-sm text-gray-500">{tutor.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{tutor.rating}</span>
                      <span className="ml-1 text-gray-500">({tutor.reviews} reviews)</span>
                    </div>
                    <span className="font-semibold text-primary text-lg">{tutor.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.badges.map((badge, badgeIndex) => (
                      <Badge key={badgeIndex} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full group-hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Tell Us What You Need</h3>
              <p className="text-gray-600">
                Describe your learning goals, subject, and preferences. We'll match you with the perfect tutor.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Connect with Tutors</h3>
              <p className="text-gray-600">
                Review tutor profiles, read reviews, and choose the one that best fits your needs and budget.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold group-hover:scale-110 transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Start Learning</h3>
              <p className="text-gray-600">
                Begin your personalized learning journey with flexible scheduling and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from students who transformed their learning with our tutors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.grade} • {testimonial.subject}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have achieved their goals with our expert tutors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/request-tutor">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/become-tutor">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                  T
                </div>
                <span className="text-xl font-bold">TutorHub</span>
              </div>
              <p className="text-gray-400">
                Connecting students with expert tutors for personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/find-tutors" className="hover:text-white transition-colors">
                    Find Tutors
                  </Link>
                </li>
                <li>
                  <Link href="/subjects" className="hover:text-white transition-colors">
                    Browse Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white transition-colors">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TutorHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
