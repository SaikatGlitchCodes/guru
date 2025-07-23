import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, BookOpen, Award, ArrowRight, CheckCircle, MessageSquare, Shield } from "lucide-react"

export default function Home() {
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
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">5,000+</div>
                      <div className="text-sm text-gray-600">Expert Tutors</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">50+</div>
                      <div className="text-sm text-gray-600">Subjects</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">98%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Mathematics', icon: '📊', color: 'bg-blue-100 text-blue-800' },
              { name: 'English', icon: '📚', color: 'bg-green-100 text-green-800' },
              { name: 'Science', icon: '🔬', color: 'bg-purple-100 text-purple-800' },
              { name: 'Computer Science', icon: '💻', color: 'bg-orange-100 text-orange-800' },
              { name: 'Languages', icon: '🌍', color: 'bg-pink-100 text-pink-800' },
              { name: 'Business', icon: '💼', color: 'bg-indigo-100 text-indigo-800' },
              { name: 'Art', icon: '🎨', color: 'bg-red-100 text-red-800' },
              { name: 'Music', icon: '🎵', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'History', icon: '📜', color: 'bg-gray-100 text-gray-800' },
              { name: 'Psychology', icon: '🧠', color: 'bg-teal-100 text-teal-800' },
            ].map((subject) => (
              <Link key={subject.name} href="/find-tutors">
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{subject.icon}</div>
                    <Badge className={subject.color}>{subject.name}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Tell Us What You Need</h3>
              <p className="text-gray-600">
                Describe your learning goals, subject, and preferences. We'll match you with the perfect tutor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect with Tutors</h3>
              <p className="text-gray-600">
                Review tutor profiles, read reviews, and choose the one that best fits your needs and budget.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Learning</h3>
              <p className="text-gray-600">
                Begin your personalized learning journey with flexible scheduling and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
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