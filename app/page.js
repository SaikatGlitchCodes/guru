"use client"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, BookOpen, Users, Star, ArrowRight, Award, Book, Shield, TrendingUp, Target, Globe, GraduationCap, MapPin, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useUser } from "@/contexts/UserContext"
import ProfileDashboard from "@/components/ProfileDashboard"
import ThemedHero from "@/components/ThemedHero"
import { getTopTutorsByRole, getAllSubjects } from "@/lib/supabaseAPI"

export default function HomePage() {
  const router = useRouter()
  const [topTutors, setTopTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjects, setSubjects] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { user, loading: userLoading, profile } = useUser()
  const [expandPlayer, setExpandPlayer] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [showPlayer, setShowPlayer] = useState(false)
  const [dataFetchTimeout, setDataFetchTimeout] = useState(false)
  const [forceLoad, setForceLoad] = useState(false)
  console.log('topTutors', topTutors)

  // if Google Auth is present take user to /request-tutor
  useEffect(() => {
    // Check for Google Auth redirect
    if (typeof window !== 'undefined') {
      const googleAuthClicked = localStorage.getItem("googleAuthClicked")
      if (googleAuthClicked === 'true') {
        router.push('/request-tutor')
        localStorage.removeItem("googleAuthClicked")
      }
    }
  }, [router])

  // Fetch top tutors and subjects from database
  useEffect(() => {
    // Skip data fetching if forced to load
    if (forceLoad) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          console.warn('Data fetch timeout - using fallback data')
          setDataFetchTimeout(true)
          setLoading(false)
        }, 10000) // 10 second timeout

        // Add timeout to prevent infinite loading
        const fetchWithTimeout = (promise, timeout = 8000) => {
          return Promise.race([
            promise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ])
        }

        // Fetch tutors and subjects in parallel with timeout
        const [tutorsResult, subjectsResult] = await Promise.allSettled([
          fetchWithTimeout(getTopTutorsByRole(4)),
          fetchWithTimeout(getAllSubjects())
        ])

        clearTimeout(timeout)

        // Handle tutors result
        if (true) {
          setTopTutors(tutorsResult.value.data)
        } else {
          console.error('Failed to fetch tutors:', tutorsResult.reason)
          setTopTutors([])
        }

        // Handle subjects result
        if (subjectsResult.status === 'fulfilled' && subjectsResult.value?.data) {
          setSubjects(subjectsResult.value.data)
        } else {
          console.error('Failed to fetch subjects:', subjectsResult.reason)
          setSubjects([])
        }

      } catch (err) {
        console.error('Error in fetchData:', err)
        setTopTutors([])
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [forceLoad])

  // Show profile dashboard only for tutors and admins, students see regular homepage
  if (user && !userLoading && profile && profile.role !== 'student') {
    return <ProfileDashboard />
  }

  // Show loading spinner with timeout protection - but only if we're actually loading data
  if ((loading && !dataFetchTimeout && !forceLoad) || (userLoading && user === null && !forceLoad)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <ThemedHero variant="light">
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div>
                {/* Title with overlapping avatars */}
                <div className="relative">
                  {<div className="flex items-start gap-2 mb-4">
                    {/* Overlapping profile avatars */}
                    <TooltipProvider>
                      <div className="flex -space-x-3 mr-4">
                        {(topTutors.length > 0 ? topTutors.slice(0, 3) : [{ id: 1 }, { id: 2 }, { id: 3 }]).map((profile, index) => (
                          <Tooltip key={profile.id || index} delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => {
                                  if (profile.id) {
                                    topTutors.length > 0 ? router.push(`/find-tutors/${profile.id}`) : null
                                  }
                                }}
                                className="w-11 h-11 cursor-pointer hover:scale-110 hover:z-10 transition-all duration-200"
                              >
                                <Avatar className="h-10 w-10 ring-2 ring-white hover:ring-green-400 transition-all duration-200">
                                  <AvatarImage src={profile.avatar || ""} alt={profile.name || "Profile"} />
                                  <AvatarFallback className="bg-green-500 text-white">
                                    {profile?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "T"}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="bg-white text-gray-800 border border-gray-200 shadow-lg p-4 max-w-xs"
                              sideOffset={8}
                            >
                              <div className="space-y-2">
                                <div className="font-semibold text-lg text-green-600">
                                  {profile.name || "Top Tutor"}
                                </div>
                                {profile.subject && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Specializes in:</span> {profile.subject}
                                  </div>
                                )}
                                {profile.rating && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-medium">{profile.rating}</span>
                                    <span className="text-gray-500">
                                      ({profile.reviews || 0} reviews)
                                    </span>
                                  </div>
                                )}
                                {profile.experience && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Experience:</span> {profile.experience}
                                  </div>
                                )}
                                {profile.hourlyRate && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Rate:</span> ₹{profile.hourlyRate}/hour
                                  </div>
                                )}
                                <div className="pt-2 border-t border-gray-100">
                                  <div className="text-xs text-green-600 font-medium">
                                    Click to view full profile →
                                  </div>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {/* Playful arrow */}
                        <div className="ml-2 mt-2">
                          <ArrowRight className="w-5 h-5 text-green-400 transform rotate-12" />
                        </div>
                      </div>
                    </TooltipProvider>
                  </div>}

                  <h1 className="text-2xl lg:text-5xl font-bold leading-tight">
                    <span className="text-black">Find your</span>{" "}
                    <span className="text-black font-bold text-4xl md:text-5xl lg:text-6xl">Perfect guru</span>
                  </h1>
                  {/* Enhanced Search Bar */}
                  <div className="md:my-8 mt-4">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 md:block hidden" />

                        <Input
                          type="text"
                          placeholder="Try 'Math', 'Physics', or 'English'"
                          value={searchTerm}
                          onChange={(e) => {
                            const value = e.target.value
                            setSearchTerm(value)

                            if (value.trim().length > 0) {
                              const filtered = subjects.filter(subject =>
                                subject.name.toLowerCase().includes(value.toLowerCase()) ||
                                subject.category?.toLowerCase().includes(value.toLowerCase())
                              ).slice(0, 8) // Limit to 8 suggestions

                              setFilteredSuggestions(filtered)
                              setShowSuggestions(filtered.length > 0)
                            } else {
                              setShowSuggestions(false)
                              setFilteredSuggestions([])
                            }
                          }}
                          className="md:pl-12 pr-4 py-4 text-lg border-green-500 rounded-xl border-2 focus:border-green-500 focus:ring-green-500 h-12"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const query = searchTerm.trim() || 'all tutors'
                              router.push(`/find-tutors?q=${encodeURIComponent(query)}`)
                              setShowSuggestions(false)
                            } else if (e.key === 'Escape') {
                              setShowSuggestions(false)
                            }
                          }}
                          onFocus={() => {
                            if (searchTerm.trim().length > 0 && filteredSuggestions.length > 0) {
                              setShowSuggestions(true)
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding suggestions to allow for clicks
                            setTimeout(() => setShowSuggestions(false), 150)
                          }}
                        />

                        {/* Auto-suggestions dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 mt-1 max-h-64 overflow-y-auto">
                            {filteredSuggestions.map((subject, index) => (
                              <div
                                key={subject.id || index}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => {
                                  setSearchTerm(subject.name)
                                  setShowSuggestions(false)
                                  const query = subject.name.trim()
                                  router.push(`/find-tutors?q=${encodeURIComponent(query)}`)
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <div>
                                    <div className="font-medium text-gray-900">{subject.name}</div>
                                    {subject.category && (
                                      <div className="text-sm text-gray-500">{subject.category}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        size="lg"
                        className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full md:rounded-xl shadow-lg shadow-green-500/20 h-12"
                        onClick={() => {
                          const query = searchTerm.trim() || 'all tutors'
                          router.push(`/find-tutors?q=${encodeURIComponent(query)}`)
                          setShowSuggestions(false)
                        }}
                      >
                        <Search className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">Search</p>
                      </Button>
                    </div>

                  </div>
                  <p className="md:text-xl text-lg text-gray-600 leading-relaxed max-w-lg mt-4">
                    We help you find the perfect guru. It&apos;s completely FREE
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:flex items-center gap-3 hidden">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-700 fill-current" />
                  </div>
                  <span className="text-gray-800">
                    Over one million students have given a 5 star review to their tutor →
                  </span>
                </div>
              </div>



              {/* CTA Buttons */}
              <div className="flex sm:flex-row gap-4 mt-5">
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
            <div className="relative space-y-6 h-full flex flex-col justify-center items-center" onMouseEnter={() => setExpandPlayer(true)} onMouseLeave={() => setExpandPlayer(false)}>
              {/* How It Works Video Circle */}
              <div className={`relative mx-auto w-fit ${!expandPlayer && !showPlayer ? 'animate-spin-slow' : 'animate-none'}`}>
                <div className={`bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center cursor-pointer group hover:scale-105 transition-all duration-300 shadow-2xl hover:animate-none ${showPlayer
                  ? 'md:w-[600px] h-96 rounded-2xl'
                  : 'w-48 h-48 rounded-full hover:rounded-2xl hover:h-96 hover:w-[600px]'
                  }`}>
                  {!showPlayer && (
                    <div onClick={() => setShowPlayer(true)} className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Play className={`w-8 h-8 text-green-500 ml-1 ${!(expandPlayer) ? 'reverse-animate-spin-slow' : 'animate-none'}`} fill="currentColor" />
                    </div>
                  )}
                  {showPlayer && (
                    <div className="w-full h-full relative rounded-2xl overflow-hidden">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowPlayer(false)}
                        className="absolute top-2 right-2 z-10 w-8 h-8 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>

                      {/* HTML5 Video Player */}
                      <video
                        className="w-full h-full object-cover"
                        src="https://uwqkktncakctujlwbacq.supabase.co/storage/v1/object/public/helpinglearners/Hey.mp4"
                        autoPlay
                        controls
                        playsInline
                        preload="metadata"
                        onLoadStart={() => console.log('Video loading started')}
                        onError={(e) => console.error('Video error:', e)}
                        onEnded={() => setTimeout(() => setShowPlayer(false), 1000)}
                      >
                        <source
                          src="https://cdn.dribbble.com/userupload/18418019/file/original-8ff51bf6e981f7da43f0f74510703ad8.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse" hidden={expandPlayer || showPlayer}></div>
              </div>
              <div className="text-center mt-4">
                <p className="text-lg font-semibold text-gray-800 cursor-pointer">How it works</p>
                <p className="text-sm text-gray-600">Watch our 20-second guide</p>
              </div>
            </div>

          </div>
        </div>

      </ThemedHero>
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

      {/* FAQ and Call to Action Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* Left Content - Call to Action */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to start learning?
                </h2>
                <p className="text-xl mb-8 text-green-50 leading-relaxed">
                  Join thousands of students who have achieved their goals with personalized tutoring and expert guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/request-tutor">
                    <Button size="lg" className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-full shadow-lg font-semibold">
                      <span className="mr-2">GET STARTED</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/find-tutors">
                    <Button variant="outline" size="lg" className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-full shadow-lg font-semibold">
                      <Search className="mr-2 h-5 w-5" />
                      Find Tutors
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Additional Info Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200 hover:border-green-300 transition-colors p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">4.9/5 Rating</h3>
                        <p className="text-gray-600 text-sm">From 10,000+ students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 hover:border-green-300 transition-colors p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Expert Tutors</h3>
                        <p className="text-gray-600 text-sm">Verified & experienced</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - Compact FAQ */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Quick FAQ
                </h3>

                <Accordion type="single" collapsible className="space-y-3">
                  {[
                    {
                      question: "How do I find a tutor?",
                      answer: "Browse verified tutors by subject, location, and budget. Filter by ratings and experience."
                    },
                    {
                      question: "What's the cost?",
                      answer: "Rates range from ₹15-100+ per hour based on subject and tutor experience."
                    },
                    {
                      question: "Online or in-person?",
                      answer: "Both options available with video platform tools for online sessions."
                    },
                    {
                      question: "Can I reschedule?",
                      answer: "Yes! Free rescheduling up to 24 hours before your session."
                    },
                    {
                      question: "Money-back guarantee?",
                      answer: "100% satisfaction guarantee - get refund or new tutor if not happy."
                    }
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="border border-gray-100 rounded-lg px-4 hover:border-green-200 transition-colors"
                    >
                      <AccordionTrigger className="text-left hover:text-green-600 transition-colors py-3 text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-3">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600 text-sm mb-3">Need more help?</p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 text-sm">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 px-4 border-t border-gray-700">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  TopTutor.Pro
                </span>
              </div>
              <p className="text-gray-400 mb-8 max-w-sm leading-relaxed text-lg">
                Find your perfect tutor and unlock your learning potential with personalized guidance.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">San Francisco, CA</p>
                    <p className="text-gray-400">United States</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Globe className="w-3 h-3 text-green-400" />
                  </div>
                  <p className="text-gray-300">hello@toptutor.pro</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Students</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/find-tutors" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Find Tutors</span>
                  </Link>
                </li>
                <li>
                  <Link href="/subjects" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Book className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>All Subjects</span>
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>How it Works</span>
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Pricing</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Tutors */}
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Tutors</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/become-tutor" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Become a Tutor</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tutor-resources" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Resources</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tutor-support" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Support</span>
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Success Stories</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Contact</span>
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Careers</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700/50 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Copyright */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <p className="text-sm text-gray-400">
                  © 2025 TopTutor.Pro. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm">
                  <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/help" className="text-gray-400 hover:text-green-400 transition-colors">
                    Help Center
                  </Link>
                </div>
              </div>

              {/* Language & Currency */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Globe className="w-3 h-3 text-green-400" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-500/10 px-3 py-2 rounded-lg transition-all">
                    🌍 English
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-500/10 px-3 py-2 rounded-lg transition-all">
                    INR (₹)
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-700/30">
              <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-500 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>108k+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>12k+ Tutors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
