"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, Clock, Users, DollarSign, LibraryBig, Navigation, Wifi } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const ITEMS_PER_PAGE = 10

export default function RequestBrowser({ initialRequests }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState("")
  const [selectedCities, setSelectedCities] = useState("")
  const [meetingTypes, setMeetingTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const allSubjects = useMemo(() => {
    const subjects = new Set()
    initialRequests.forEach((req) => {
      req.subjects.forEach((subject) => subjects.add(subject.name))
    })
    return Array.from(subjects).sort()
  }, [initialRequests])

  const allCities = useMemo(() => {
    const cities = new Set()
    initialRequests.forEach((req) => {
      cities.add(`${req.address.city}, ${req.address.state}`)
    })
    return Array.from(cities).sort()
  }, [initialRequests])

  const allLanguages = useMemo(() => {
    const languages = new Set()
    initialRequests.forEach((req) => {
      req.language.forEach((lang) => languages.add(lang.label))
    })
    return Array.from(languages).sort()
  }, [initialRequests])

  const filteredRequests = useMemo(() => {
    return initialRequests.filter((request) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          request.subjects.some((subject) => subject.name.toLowerCase().includes(query)) ||
          request.description.toLowerCase().includes(query) ||
          request.address.city.toLowerCase().includes(query) ||
          request.address.state.toLowerCase().includes(query) ||
          request.type.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Subject filter
      if (selectedSubjects) {
        const query = selectedSubjects.toLowerCase()
        const hasMatchingSubject = request.subjects.some((subject) => 
          subject.name.toLowerCase().includes(query)
        )
        if (!hasMatchingSubject) return false
      }

      // City filter
      if (selectedCities) {
        const query = selectedCities.toLowerCase()
        const cityState = `${request.address.city}, ${request.address.state}`.toLowerCase()
        if (!cityState.includes(query)) return false
      }

      // Meeting type filter
      if (meetingTypes.length > 0) {
        const hasMatchingMeeting =
          (meetingTypes.includes("online") && request.online_meeting) ||
          (meetingTypes.includes("offline") && request.offline_meeting) ||
          (meetingTypes.includes("travel") && request.travel_meeting)

        if (!hasMatchingMeeting) return false
      }

      // Price range filter
      const price = Number.parseFloat(request.price_amount)
      if (price < priceRange[0] || price > priceRange[1]) return false

      // Language filter
      if (selectedLanguages.length > 0) {
        const hasMatchingLanguage = request.language.some((lang) => selectedLanguages.includes(lang.label))
        if (!hasMatchingLanguage) return false
      }

      return true
    })
  }, [initialRequests, searchQuery, selectedSubjects, selectedCities, meetingTypes, priceRange, selectedLanguages])

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subject])
    } else {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    }
    setCurrentPage(1)
  }

  const handleCityChange = (city, checked) => {
    if (checked) {
      setSelectedCities([...selectedCities, city])
    } else {
      setSelectedCities(selectedCities.filter((c) => c !== city))
    }
    setCurrentPage(1)
  }

  const handleMeetingTypeChange = (type, checked) => {
    if (checked) {
      setMeetingTypes([...meetingTypes, type])
    } else {
      setMeetingTypes(meetingTypes.filter((t) => t !== type))
    }
    setCurrentPage(1)
  }

  const handleLanguageChange = (language, checked) => {
    if (checked) {
      setSelectedLanguages([...selectedLanguages, language])
    } else {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language))
    }
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedSubjects('')
    setSelectedCities([])
    setMeetingTypes([])
    setPriceRange([0, 5000])
    setSelectedLanguages([])
    setCurrentPage(1)
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "within a week":
        return "bg-yellow-100 text-yellow-800"
      case "flexible":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "tutoring":
        return "bg-blue-100 text-blue-800"
      case "assignment":
        return "bg-purple-100 text-purple-800"
      case "job support":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:py-6 rounded-b-2xl" style={{ backgroundImage: 'url(/background5.png)' }} >
        <div className="flex-1 p-6 rounded-lg">
          <p className="text-gray-600 text-center">Find tutoring opportunities that match your expertise</p>
          <div className="mt-4 flex md:flex-row flex-col gap-y-3 items-center gap-x-3 mx-auto justify-center">
            <div className="relative w-64">
              <LibraryBig className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Subjects (e.g., 'Math', 'English')"
                value={selectedSubjects}
                onChange={(e) => {
                  setSelectedSubjects(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-white"
              />
            </div>
            <div className="relative w-64">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Location (e.g., 'Minnesota', 'Delhi')"
                value={selectedCities}
                onChange={(e) => {
                  setSelectedCities(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-white"
              />
            </div>
            <Button
              variant="outline"
              className="w-32 bg-black text-white"
              onClick={() => console.log("Search clicked")}
            >
              <Search className="h-4 w-4 mr-2 " />
              Search
            </Button>

          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Button variant='outline' className='py-0 font-normal'>Online</Button>
            <Button variant='outline' className='py-0 font-normal'>Offline</Button>
            <Button className='py-0 font-normal'>Travel</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 container mx-auto px-4 xl:px-16">
        {/* Results */}
        <div className="flex-1">
          

          {filteredRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more requests.
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {paginatedRequests.map((request, index) => (
                  <Card key={index} className="shadow-none border-0 hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="px-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-[23px] font-normal text-gray-700 mb-2 line-clamp-2">
                          Need {request.subjects.map((s) => s.name).join(", ")} Help in {request.address.city} –{" "}
                          {request.price_currency_symbol}
                          {request.price_amount} {request.price_option}
                        </h3>
                        {/* Subject */}
                        <div className="mb-4 flex gap-x-3 items-center">
                          <div className="flex flex-wrap gap-1">
                            {request.subjects.map((subject, index) => (
                              <Badge key={index} variant="outline" className="text-md font-normal">
                                {subject.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1 ms-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {request.online_meeting ? <Wifi className="h-5 w-5" /> : <Wifi className="h-5 w-5 text-gray-300" />}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Student is available Online</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {request.offline_meeting ? <MapPin className="h-5 w-5" /> : <MapPin className="h-5 w-5 text-gray-300" />}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Student is available Offline</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {request.travel_meeting ? <Navigation className="h-5 w-5" /> : <Navigation className="h-5 w-5 text-gray-300" />}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Student can travel</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-3">{request.description}</p>

                      {/* extra details badge */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(request.type)}>
                          {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                        </Badge>
                        <Badge className={getUrgencyColor(request.i_need_someone)}>
                          <Clock className="h-3 w-3 mr-1" />
                          {request.i_need_someone}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-gray-600 flex flex-wrap gap-x-8 mt-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {request.address.city}, {request.address.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {request.level} • {request.nature}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-gray-900">
                            {request.price_currency_symbol}
                            {request.price_amount} {request.price_option}
                          </span>
                        </div>
                      </div>

                      {/* Languages */}
                      {/* <div className="mt-4 pt-4 border-t">
                        <div className="flex flex-wrap gap-1">
                          {request.language.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang.label}
                            </Badge>
                          ))}
                        </div>
                      </div> */}

                      {/* Action Button */}
                      {/* <div className="mt-4">
                        <Button className="w-full">Apply for Request</Button>
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}