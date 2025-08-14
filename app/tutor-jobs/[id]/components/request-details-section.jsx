"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Zap, 
  Globe, 
  Home, 
  Car, 
  CheckCircle, 
  XCircle,
  Languages
} from "lucide-react"

export default function RequestDetailsSection({ request }) {
  if (!request) return null

  return (
    <div className="space-y-6">
      {/* Learning Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Learning Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-3 overflow-hidden word-break">
            {request.description || "Detailed learning objectives will be shared after you contact the student."}
          </p>
        </CardContent>
      </Card>

      {/* Teaching Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Teaching Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Meeting Types */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Preferred Meeting Types</h4>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  request.online_meeting 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  <Globe className="w-4 h-4" />
                  <span>Online Sessions</span>
                  {request.online_meeting ? (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 ml-auto" />
                  )}
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  request.offline_meeting 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  <Home className="w-4 h-4" />
                  <span>In-Person Sessions</span>
                  {request.offline_meeting ? (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 ml-auto" />
                  )}
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  request.travel_meeting 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  <Car className="w-4 h-4" />
                  <span>Tutor Can Travel</span>
                  {request.travel_meeting ? (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 ml-auto" />
                  )}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Communication Languages</h4>
              {request.language && request.language.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {request.language.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      <Languages className="w-3 h-3 mr-1" />
                      {lang.label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Language preferences not specified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
