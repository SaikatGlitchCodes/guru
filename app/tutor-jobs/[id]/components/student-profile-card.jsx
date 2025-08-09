"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  MapPin,
  CheckCircle,
  BookOpen,
  Star,
  Timer,
  UserCheck,
  Clock,
  GraduationCap,
  AlertTriangle
} from "lucide-react"

export default function StudentProfileCard({ 
  request, 
  timeAgo, 
  shouldShowRecommendation 
}) {
  if (!request) return null

  const urgency = request?.urgency?.toLowerCase() || 'flexible';

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-black to-black rounded-t-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{request.student_name || 'Student'}</h1>
                <p className="text-blue-100">{request.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {request.address?.city || 'Remote'}, {request.address?.country || 'Global'}
                    </span>
                  </div>
                  {request.phone_verified && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {request.price_currency_symbol || '€'}{request.price_amount || '0'}
              </div>
              <div className="text-blue-100 text-sm">per hour</div>
            </div>
          </div>
        </div>

        {/* Subject Tags */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-2">
            {(request.subjects || []).map((subject, index) => (
              <Badge 
                key={index} 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                {subject.name}
              </Badge>
            ))}
            {(!request.subjects || request.subjects.length === 0) && (
              <Badge className="bg-gray-50 text-gray-600">
                <GraduationCap className="w-3 h-3 mr-1" />
                General Tutoring
              </Badge>
            )}
          </div>
        </div>

        {/* Key Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{request.level || 'All Levels'}</p>
                <p className="text-sm text-gray-500">Skill Level</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Timer className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{request.schedule || 'Flexible'}</p>
                <p className="text-sm text-gray-500">Schedule</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                urgency === 'high' ? 'bg-red-50' : 
                urgency === 'medium' ? 'bg-yellow-50' : 'bg-gray-50'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  urgency === 'high' ? 'text-red-600' : 
                  urgency === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">{urgency} Priority</p>
                <p className="text-sm text-gray-500">Urgency Level</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {request.gender_preference || 'No Preference'}
                </p>
                <p className="text-sm text-gray-500">Gender Preference</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Posted {timeAgo} hours ago</p>
                <p className="text-sm text-gray-500">Timeline</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Already Paid Alert */}
      {request.hasAlreadyPaid && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Great news!</strong> You've already paid for this request. 
            You can access the student's contact details anytime.
          </AlertDescription>
        </Alert>
      )}

      {/* High Competition Alert */}
      {shouldShowRecommendation && !request.hasAlreadyPaid && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            <strong>High Competition:</strong> {(request.contacted_count || 0)} tutors 
            have already applied for this position.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
