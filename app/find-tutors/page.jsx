"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, MapPin, Clock, BookOpen, Award, Users } from "lucide-react"
import { getAllTutors } from '@/lib/supabaseAPI'

// Sample tutors data (fallback if API fails)
const sampleTutors = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    total_reviews: 127,
    subjects: ["Mathematics", "Physics"],
    experience_years: 5,
    hourly_rate: 45,
    location: "New York, NY",
    bio: "Experienced math tutor with PhD in Applied Mathematics. Specializing in calculus and algebra.",
    verified: true,
    response_time: "< 1 hour",
    availability_status: "Available now"
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    total_reviews: 89,
    subjects: ["Computer Science", "Programming"],
    experience_years: 7,
    hourly_rate: 60,
    location: "San Francisco, CA",
    bio: "Senior software engineer turned tutor. Expert in Python, JavaScript, and web development.",
    verified: true,
    response_time: "< 2 hours",
    availability_status: "Available today"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    total_reviews: 156,
    subjects: ["English", "Literature"],
    experience_years: 8,
    hourly_rate: 40,
    location: "Austin, TX",
    bio: "English professor with expertise in creative writing and literature analysis.",
    verified: true,
    response_time: "< 30 min",
    availability_status: "Available now"
  },
  {
    id: 4,
    name: "David Kim",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    total_reviews: 73,
    subjects: ["Chemistry", "Biology"],
    experience_years: 4,
    hourly_rate: 35,
    location: "Boston, MA",
    bio: "Medical student with strong background in sciences. Patient and encouraging teaching style.",
    verified: true,
    response_time: "< 3 hours",
    availability_status: "Available tomorrow"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    total_reviews: 92,
    subjects: ["Spanish", "French"],
    experience_years: 6,
    hourly_rate: 38,
    location: "Miami, FL",
    bio: "Native Spanish speaker with certification in language teaching. Fluent in 4 languages.",
    verified: true,
    response_time: "< 1 hour",
    availability_status: "Available now"
  },
  {
    id: 6,
    name: "Robert Wilson",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    total_reviews: 45,
    subjects: ["Business", "Economics"],
    experience_years: 10,
    hourly_rate: 55,
    location: "Chicago, IL",
    bio: "Former investment banker with MBA. Specializes in business strategy and financial analysis.",
    verified: true,
    response_time: "< 4 hours",
    availability_status: "Available this week"
  }
]

export default function FindTutorsPage() {
  const [tutors, setTutors] = useState(sampleTutors)
  const [filteredTutors, setFilteredTutors] = useState(sampleTutors)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState(undefined)
  const [selectedLocation, setSelectedLocation] = useState(undefined)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("rating")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const allTutors = await getAllTutors()
        if (allTutors.data && allTutors.data.length > 0) {
          setTutors(allTutors.data)
          setFilteredTutors(allTutors.data)
        } else {
          // Use sample data as fallback
          setTutors(sampleTutors)
          setFilteredTutors(sampleTutors)
        }
      } catch (error) {
        console.error("Error fetching tutors:", error)
        // Use sample data as fallback
        setTutors(sampleTutors)
        setFilteredTutors(sampleTutors)
      } finally {
        setLoading(false)
      }
    }
    fetchTutors()
  }, [])

  // Get unique subjects and locations for filters
  const subjects = [...new Set(tutors.flatMap(tutor => tutor.subjects || []))].filter(Boolean).sort()
  const locations = [...new Set(tutors.map(tutor => tutor.location).filter(Boolean))].sort()

  useEffect(() => {
    let filtered = tutors.filter(tutor => {
      const matchesSearch = searchQuery === "" ||
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tutor.subjects && tutor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (tutor.bio && tutor.bio.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSubject = selectedSubject === "" || selectedSubject === undefined ||
        (tutor.subjects && tutor.subjects.includes(selectedSubject))
      const matchesLocation = selectedLocation === "" || selectedLocation === undefined ||
        tutor.location === selectedLocation
      const matchesPrice = tutor.hourly_rate >= priceRange[0] && tutor.hourly_rate <= priceRange[1]
      const matchesRating = tutor.rating >= minRating

      return matchesSearch && matchesSubject && matchesLocation && matchesPrice && matchesRating
    })

    // Sort tutors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.hourly_rate - b.hourly_rate
        case "price-high":
          return b.hourly_rate - a.hourly_rate
        case "experience":
          return b.experience_years - a.experience_years
        case "reviews":
          return b.total_reviews - a.total_reviews
        default:
          return 0
      }
    })

    setFilteredTutors(filtered)
  }, [tutors, searchQuery, selectedSubject, selectedLocation, priceRange, minRating, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSubject(undefined)
    setSelectedLocation(undefined)
    setPriceRange([0, 100])
    setMinRating(0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading tutors...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Tutor</h1>
            <p className="text-xl text-blue-100">Connect with expert tutors for personalized learning</p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by subject, tutor name, or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            checked={minRating === rating}
                            onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                          />
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{rating}+ ({tutors.filter(t => t.rating >= rating).length})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Availability</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Available now</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Available today</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox />
                        <span className="text-sm">Available this week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutors List */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredTutors.length} Tutors Found
                </h2>
                <p className="text-gray-600">Find the perfect tutor for your learning needs</p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tutors Grid */}
            <div className="grid gap-6">
              {filteredTutors.map(tutor => (
                <Card key={tutor.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tutor Avatar and Basic Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={tutor.avatar_url} alt={tutor.name} />
                          <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{tutor.name}</h3>
                            {tutor.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                <Award className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{tutor.rating}</span>
                              <span>({tutor.total_reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{tutor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{tutor.response_time}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {tutor.subjects && tutor.subjects.map(subject => (
                              <Badge key={subject} variant="outline">{subject}</Badge>
                            ))}
                          </div>

                          <p className="text-gray-600 text-sm mb-4">{tutor.bio}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{tutor.experience_years} years exp.</span>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">
                                {tutor.availability_status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${tutor.hourly_rate}
                                <span className="text-sm font-normal text-gray-600">/hour</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t">
                      <Button className="flex-1">
                        Contact Tutor
                      </Button>
                      <Button variant="outline" className="flex-1">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTutors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tutors found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more tutors.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}