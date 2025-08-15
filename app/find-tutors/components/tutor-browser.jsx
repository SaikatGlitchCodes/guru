"use client"

import { useRouter } from "next/navigation"
import { 
  MapPin, 
  Star,
  Clock,
  Award,
  BookOpen,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Pagination from "@/components/ui/pagination"

export default function TutorBrowser({ 
  tutors = [], 
  totalItems = 0,
  currentPage = 1, 
  itemsPerPage = 8,
  isLoading = false,
  onPageChange 
}) {
  const router = useRouter()

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (page) => {
    onPageChange?.(page)
    // Scroll to top of the results when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewProfile = async (tutor) => {
    router.push(`/find-tutors/${tutor.id}`)
  }

  const TutorCard = ({ tutor }) => {
    return (
      <Card className="w-full max-w-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tutor Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar className="w-20 h-20 mx-auto sm:mx-0 flex-shrink-0">
                <AvatarImage src={tutor.avatar_url} alt={tutor.name} />
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  {tutor.name?.split(' ').map(n => n[0]).join('') || 'T'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold cursor-pointer hover:text-blue-600" 
                      onClick={() => handleViewProfile(tutor)}>
                    {tutor.name}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {tutor.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Award className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {tutor.availability_status === 'available' && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tutor.rating || 0}</span>
                    <span>({tutor.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{tutor.city ? `${tutor.city}, ${tutor.state}` : 'Location not set'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutor.response_time || '< 24 hours'}</span>
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                  {tutor.subjects?.slice(0, 4).map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subject.name || subject}
                    </Badge>
                  ))}
                  {tutor.subjects?.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{tutor.subjects.length - 4} more
                    </Badge>
                  )}
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tutor.bio || 'Experienced tutor ready to help you succeed in your learning journey.'}
                </p>

                {/* Experience and Languages */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{tutor.experience_years || tutor.years_of_experience || 0} years experience</span>
                  </div>
                  {tutor.languages && tutor.languages.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                      <span>Languages:</span>
                      <span>{tutor.languages.slice(0, 2).join(', ')}</span>
                      {tutor.languages.length > 2 && <span>+{tutor.languages.length - 2} more</span>}
                    </div>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-gray-900">
                      ${tutor.hourly_rate || 0}
                      <span className="text-sm font-normal text-gray-600">/hour</span>
                    </div>
                    {tutor.instant_booking && (
                      <span className="text-xs text-green-600">✓ Instant booking</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Card key={index} className="w-full max-w-full">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tutors.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tutors found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more tutors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Results
            </Button>
            <Button 
              onClick={() => router.push('/request-tutor')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create a Tutor Request
            </Button>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Can't find what you're looking for?</strong><br />
              Create a request and let qualified tutors come to you!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards List */}
      <div className="space-y-6">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-8 border-t pt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showInfo={true}
          className="justify-center"
        />
      </div>
      
      {/* Results summary for single page */}
      {totalPages <= 1 && tutors.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing {tutors.length} tutors
          </p>
        </div>
      )}
    </div>
  )
}
