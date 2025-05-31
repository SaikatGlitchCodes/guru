"use client"

import { useState, useMemo } from "react"
import { Search, Filter, MapPin, Clock, Users, DollarSign, LibraryBig, Navigation } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const ITEMS_PER_PAGE = 10

export default function RequestBrowser({ initialRequests }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState('')
  const [selectedCities, setSelectedCities] = useState([])
  const [meetingTypes, setMeetingTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  // Extract unique values for filters
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

  // Filter requests based on current filters
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
      if (selectedSubjects.length > 0) {
        const hasMatchingSubject = request.subjects.some((subject) => selectedSubjects.includes(subject.name))
        if (!hasMatchingSubject) return false
      }

      // City filter
      if (selectedCities.length > 0) {
        const cityState = `${request.address.city}, ${request.address.state}`
        if (!selectedCities.includes(cityState)) return false
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

  // Pagination
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

  const getMeetingOptions = (request) => {
    const options = []
    if (request.online_meeting) options.push("Online")
    if (request.offline_meeting) options.push("Offline")
    if (request.travel_meeting) options.push("Travel")
    return options
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4" style={{ backgroundImage: 'url(/background.png)' }} >
        <div className="flex-1 lg:p-6 p-0 rounded-lg">
          <p className="text-gray-600 text-center">Find tutoring opportunities that match your expertise</p>
          <div className="mt-4 flex flex-col gap-y-3 items-center gap-x-3 mx-auto justify-center">
            <div className="relative w-64 bg-white">
              <LibraryBig className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Subjects (e.g., 'Math', 'English')"
                value={searchQuery}
                onChange={(e) => {
                  setSelectedSubjects(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="relative w-64 bg-white">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Location (e.g., 'Menesota', 'Delhi')"
                value={searchQuery}
                onChange={(e) => {
                  setSelectedCities(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""} found
            </p>
          </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          Need {request.subjects.map((s) => s.name).join(", ")} Help in {request.address.city} –{" "}
                          {request.price_currency_symbol}
                          {request.price_amount} {request.price_option}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getTypeColor(request.type)}>
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                          </Badge>
                          <Badge className={getUrgencyColor(request.i_need_someone)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {request.i_need_someone}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{request.description}</p>

                      {/* Subjects */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {request.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Meeting Options */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {getMeetingOptions(request).map((option, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-gray-600">
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
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex flex-wrap gap-1">
                          {request.language.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Button className="w-full">Apply for Request</Button>
                      </div>
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

function FilterContent({
  allSubjects,
  allCities,
  allLanguages,
  selectedSubjects,
  selectedCities,
  meetingTypes,
  priceRange,
  selectedLanguages,
  onSubjectChange,
  onCityChange,
  onMeetingTypeChange,
  onPriceRangeChange,
  onLanguageChange,
}) {
  return (
    <div className="space-y-6">
      {/* Subjects */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Subjects</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {allSubjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${subject}`}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={(checked) => onSubjectChange(subject, checked)}
              />
              <Label htmlFor={`subject-${subject}`} className="text-sm">
                {subject}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Location</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {allCities.map((city) => (
            <div key={city} className="flex items-center space-x-2">
              <Checkbox
                id={`city-${city}`}
                checked={selectedCities.includes(city)}
                onCheckedChange={(checked) => onCityChange(city, checked)}
              />
              <Label htmlFor={`city-${city}`} className="text-sm">
                {city}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Types */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Meeting Type</Label>
        <div className="space-y-2">
          {["online", "offline", "travel"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`meeting-${type}`}
                checked={meetingTypes.includes(type)}
                onCheckedChange={(checked) => onMeetingTypeChange(type, checked)}
              />
              <Label htmlFor={`meeting-${type}`} className="text-sm capitalize">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={onPriceRangeChange}
          max={5000}
          min={0}
          step={100}
          className="w-full"
        />
      </div>

      {/* Languages */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Languages</Label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {allLanguages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={`language-${language}`}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={(checked) => onLanguageChange(language, checked)}
              />
              <Label htmlFor={`language-${language}`} className="text-sm">
                {language}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
