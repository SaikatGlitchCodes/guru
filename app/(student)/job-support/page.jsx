"use client"

export default function JobSupportPage() {
  const router = useRouter()
import { useState } from "react"
  const handleRequestSupport = () => {
    // Navigate to request tutor page with job support pre-selected
    router.push('/request-tutor?type=job-support')
  }
import { useRouter } from "next/navigation"
  const services = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Resume & CV Review",
      description: "Get your resume professionally reviewed and optimized for your target roles"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "Interview Preparation",
      description: "Practice with mock interviews and get expert feedback on your performance"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Career Strategy",
      description: "Develop a personalized career plan and job search strategy"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "LinkedIn Optimization",
      description: "Optimize your LinkedIn profile to attract recruiters and opportunities"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-600" />,
      title: "Skill Development",
      description: "Identify and develop the skills needed for your dream job"
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Industry Insights",
      description: "Get insider knowledge about your target industry and companies"
    }
  ]
import { Button } from "@/components/ui/button"
  const successStories = [
    {
      name: "Alex Thompson",
      role: "Software Engineer",
      company: "Google",
      improvement: "Landed dream job in 6 weeks",
      quote: "The interview prep was game-changing. I felt confident and prepared for every question."
    },
    {
      name: "Maria Garcia",
      role: "Marketing Manager",
      company: "Netflix",
      improvement: "40% salary increase",
      quote: "My mentor helped me negotiate a much better offer than I thought possible."
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      company: "Microsoft",
      improvement: "Career pivot successful",
      quote: "Transitioned from finance to tech with personalized guidance and support."
    }
  ]
import { Card, CardContent } from "@/components/ui/card"
  const process = [
    {
      step: 1,
      title: "Tell Us Your Goals",
      description: "Share your career objectives, current situation, and what you need help with"
    },
    {
      step: 2,
      title: "Get Matched",
      description: "We'll connect you with industry experts who specialize in your field"
    },
    {
      step: 3,
      title: "Start Your Journey",
      description: "Begin working with your mentor to achieve your career goals"
    }
  ]
import { Badge } from "@/components/ui/badge"
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-6">
              💼 Professional Career Support
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Accelerate Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Career Growth
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get personalized career coaching, interview preparation, and job search support 
              from industry professionals who've been where you want to go.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                onClick={handleRequestSupport}
              >
                Get Career Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
                View Success Stories
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Career experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-gray-600">Job placement rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
                <div className="text-gray-600">Faster job search</div>
              </div>
            </div>
          </div>
        </div>
      </section>
import { 
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Career Support Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support to help you land your dream job and advance your career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  Briefcase, 
      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get the career support you need</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  Users, 
      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real results from real professionals</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4" />
                    <h4 className="text-lg font-semibold">{story.name}</h4>
                    <p className="text-gray-600">{story.role} at {story.company}</p>
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      {story.improvement}
                    </Badge>
                  </div>
                  
                  <blockquote className="text-gray-700 italic text-center">
                    "{story.quote}"
                  </blockquote>
                  
                  <div className="flex justify-center mt-4">
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  FileText, 
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Career Support?</h2>
              <p className="text-xl text-gray-600">
                We provide comprehensive, personalized support to help you succeed
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Industry Experts</h3>
                    <p className="text-gray-600">Work with professionals who have hiring experience at top companies</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                    <p className="text-gray-600">Get support on your schedule with evening and weekend availability</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
                    <p className="text-gray-600">85% of our clients receive job offers within 3 months</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personalized Approach</h3>
                    <p className="text-gray-600">Customized strategies based on your unique background and goals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ongoing Support</h3>
                    <p className="text-gray-600">Continuous guidance throughout your job search and beyond</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Money-Back Guarantee</h3>
                    <p className="text-gray-600">We're confident in our results - satisfaction guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  MessageSquare, 
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Don't let your dream job slip away. Get the professional support you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={handleRequestSupport}
              >
                Start Your Career Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
  CheckCircle, 
  ArrowRight, 
  Star,
  Clock,
  Award,
  Target,
  TrendingUp,
  Shield
} from "lucide-react"