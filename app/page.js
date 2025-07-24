"use client"

import { useState } from "react"
import { Search, BookOpen, Users, Star, ArrowRight, Play, MessageSquare, Calendar, Award, Sigma, Radiation, FlaskConical, Book, Computer, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

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
  const searchTutor = () => {
    router.replace(`/find-tutors?query=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Animated Background */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200/30 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-orange-200/30 rounded-full animate-bounce delay-700"></div>

          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="text-primary block">Tutor Today</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with expert tutors who understand your learning style. Get personalized help in any subject,
              anytime, anywhere.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="What subject do you need help with?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-primary shadow-lg"
                />
                <button onClick={searchTutor} className="bg-black text-white absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 py-2 flex items-center" asChild>
                  Find Tutors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button variant="outline" className="rounded-full hover:scale-105 transition-transform shadow-md" asChild>
                <a to="/request-tutor">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Request a Tutor
                </a>
              </Button>
              <Button variant="outline" className="rounded-full hover:scale-105 transition-transform shadow-md">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
              <Button variant="outline" className="rounded-full hover:scale-105 transition-transform shadow-md">
                <MessageSquare className="mr-2 h-4 w-4" />
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Subjects</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our most requested subjects and connect with expert tutors instantly
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSubjects.map((subject, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
              >
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
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="rounded-full hover:scale-105 transition-transform">
              View All Subjects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
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

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="rounded-full hover:scale-105 transition-transform">
              View All Tutors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to find your perfect tutor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">1. Tell Us What You Need</h3>
              <p className="text-gray-600">
                Share your subject, level, and learning goals. We'll match you with the perfect tutor.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">2. Choose Your Tutor</h3>
              <p className="text-gray-600">
                Browse profiles, read reviews, and select a tutor that fits your schedule and budget.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">3. Start Learning</h3>
              <p className="text-gray-600">
                Book your first session and begin your personalized learning journey today.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="rounded-full px-8 hover:scale-105 transition-transform shadow-lg" asChild>
              <a to="/request-tutor">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-blue-50 px-4">
        <div className="container mx-auto">
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
      <section className="py-20 bg-primary text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Excel in Your Studies?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who have improved their grades and confidence with our expert tutors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full px-8 hover:scale-105 transition-transform" asChild>
              <a to="/request-tutor">
                Find My Tutor
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-white border-white hover:bg-white hover:text-primary hover:scale-105 transition-all"
            >
              Learn More
            </Button>
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
                  <a to="/find-tutors" className="hover:text-white transition-colors">
                    Find Tutors
                  </a>
                </li>
                <li>
                  <a to="/subjects" className="hover:text-white transition-colors">
                    Browse Subjects
                  </a>
                </li>
                <li>
                  <a to="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a to="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a to="/help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a to="/safety" className="hover:text-white transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a to="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a to="/about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a to="/careers" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a to="/blog" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a to="/press" className="hover:text-white transition-colors">
                    Press
                  </a>
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
  )
}

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