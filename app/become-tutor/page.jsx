"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, BookOpen, DollarSign, Clock, Star, ArrowRight, Award, Shield, TrendingUp } from "lucide-react"
import AuthModal from "@/components/auth-modal"

export default function BecomeTutorPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Earn Great Money",
      description: "Set your own rates and earn $20-100+ per hour based on your expertise"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Flexible Schedule",
      description: "Work when you want, where you want. Perfect for busy professionals"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Help Students Succeed",
      description: "Make a real impact by helping students achieve their academic goals"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Grow Your Reputation",
      description: "Build your teaching portfolio and establish yourself as an expert"
    }
  ]

  const requirements = [
    "Bachelor's degree or equivalent experience in your subject area",
    "Strong communication skills and patience",
    "Reliable internet connection for online sessions",
    "Passion for teaching and helping others learn"
  ]

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and complete your tutor profile with your qualifications and experience"
    },
    {
      number: 2,
      title: "Get Verified",
      description: "We'll verify your credentials and approve your profile within 24-48 hours"
    },
    {
      number: 3,
      title: "Start Teaching",
      description: "Browse student requests and start connecting with learners who need your help"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-6">
              🎓 Join 5,000+ Expert Tutors
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Share Your Knowledge,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Earn Great Money
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Turn your expertise into income. Join our platform and start teaching students 
              from around the world while building your reputation as an expert educator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <AuthModal 
                defaultRole="tutor" 
                triggerText="Start Teaching Today"
              />
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$45</div>
                <div className="text-gray-600">Average hourly rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Flexible scheduling</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Tutor satisfaction rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Teach With Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of educators who have found success on our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What We're Looking For</h2>
              <p className="text-xl text-gray-600">
                We maintain high standards to ensure the best experience for our students
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-lg text-gray-700">{requirement}</p>
                  </div>
                ))}
              </div>
              
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Background verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-600">Credentials validated</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-600">Quality assured</span>
                    </div>
                  </div>
                  <AuthModal 
                    defaultRole="tutor" 
                    triggerText="Apply Now"
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Start earning in just 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our top-earning tutors</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "I've been tutoring on this platform for 2 years and consistently earn $3,000+ per month. 
                  The flexibility allows me to balance my day job while building my teaching career."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">Mathematics Tutor</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The platform connected me with students worldwide. I love helping them succeed, 
                  and the extra income has been life-changing for my family."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">David L.</p>
                  <p className="text-sm text-gray-600">Physics & Engineering</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "What I love most is the impact I make. Seeing my students improve their grades 
                  and confidence makes every session worth it."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Maria R.</p>
                  <p className="text-sm text-gray-600">Language Teacher</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Teaching Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of expert tutors and start making a difference while earning great money.
            </p>
            <AuthModal 
              defaultRole="tutor" 
              triggerText="Get Started Today"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-6">
              🎓 Join 5,000+ Expert Tutors
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Share Your Knowledge,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Earn Great Money
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Turn your expertise into income. Join our platform and start teaching students 
              from around the world while building your reputation as an expert educator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <AuthModal 
                defaultRole="tutor" 
                triggerText="Start Teaching Today"
              />
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$45</div>
                <div className="text-gray-600">Average hourly rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Flexible scheduling</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Tutor satisfaction rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Teach With Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of educators who have found success on our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Get Started</h2>
            <p className="text-xl text-gray-600">Simple steps to begin your tutoring journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tutor Requirements</h2>
              <p className="text-xl text-gray-600">
                We maintain high standards to ensure the best learning experience for our students
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">What We Look For:</h3>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-4">Quality Assurance</h4>
                    <p className="text-gray-600 mb-6">
                      All tutors go through our verification process to ensure they meet our high standards for education and teaching ability.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Background Check</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>Skill Assessment</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our top-performing tutors</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                subject: "Mathematics",
                earnings: "$3,200/month",
                quote: "Teaching on this platform has allowed me to help hundreds of students while earning great income from home.",
                rating: 4.9,
                students: 150
              },
              {
                name: "Michael Chen",
                subject: "Computer Science",
                earnings: "$4,500/month",
                quote: "The flexibility is amazing. I can teach around my full-time job and still make significant extra income.",
                rating: 4.8,
                students: 89
              },
              {
                name: "Emily Rodriguez",
                subject: "English Literature",
                earnings: "$2,800/month",
                quote: "I love seeing my students improve and succeed. The platform makes it easy to connect with motivated learners.",
                rating: 4.9,
                students: 200
              }
            ].map((story, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4" />
                    <h4 className="text-lg font-semibold">{story.name}</h4>
                    <p className="text-gray-600">{story.subject} Tutor</p>
                  </div>
                  
                  <blockquote className="text-gray-700 italic mb-6">
                    "{story.quote}"
                  </blockquote>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Earnings:</span>
                      <span className="font-semibold text-green-600">{story.earnings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{story.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students Taught:</span>
                      <span className="font-semibold">{story.students}+</span>
                    </div>
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
              Ready to Start Your Teaching Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of expert tutors and start making a difference while earning great money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthModal 
                defaultRole="tutor" 
                triggerText="Apply to Become a Tutor"
              />
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
