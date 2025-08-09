"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  Eye, 
  CheckCircle,
  Coins,
  User,
  XCircle,
  TrendingUp,
  Shield,
  Heart
} from "lucide-react"
import { getPopularityLevel } from "@/lib/contactPricing"

export default function ContactSidebar({ 
  request, 
  user, 
  profile, 
  contactCost, 
  contacting, 
  onContactStudent, 
  onShowContactModal 
}) {
  if (!request) return null

  return (
    <div className="space-y-6">
      {/* Contact Card */}
      <Card className="sticky top-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            {request.hasAlreadyPaid ? 'Contact Details' : 'Apply for this Job'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.hasAlreadyPaid ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Already Purchased</span>
                </div>
                <p className="text-green-600 text-sm">
                  You've already paid for this request. Click below to view contact details.
                </p>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => onShowContactModal(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Contact Details
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {contactCost} Coins
                </div>
                <p className="text-sm text-blue-600">Required to contact student</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Your balance:</span>
                  <span className="font-medium">{profile?.coin_balance || 0} coins</span>
                </div>
                <div className="flex justify-between">
                  <span>After purchase:</span>
                  <span className="font-medium">
                    {(profile?.coin_balance || 0) - contactCost} coins
                  </span>
                </div>
              </div>

              {!user || !profile ? (
                <Alert className="p-3 border-blue-200 bg-blue-50">
                  <User className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-700">
                    Please sign in to contact the student and view pricing details.
                  </AlertDescription>
                </Alert>
              ) : profile.coin_balance < contactCost && (
                <Alert className="p-3">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Insufficient coins. You need {contactCost - profile.coin_balance} more coins.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={onContactStudent}
                disabled={contacting || (user && profile && profile.coin_balance < contactCost)}
              >
                {contacting ? (
                  "Processing..."
                ) : !user || !profile ? (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Sign In to Contact Student
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Contact Student
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Job Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Job Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{request.view_count || 0}</div>
              <div className="text-xs text-blue-600">Views</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{request.contacted_count || 0}</div>
              <div className="text-xs text-green-600">Applied</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Popularity</span>
              <Badge variant="outline" className={getPopularityLevel(request.view_count || 0).color}>
                {getPopularityLevel(request.view_count || 0).level}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Competition</span>
              <Badge variant="outline" className={(request.contacted_count || 0) >= 3 ? "border-red-200 text-red-700" : "border-green-200 text-green-700"}>
                {(request.contacted_count || 0) >= 3 ? "High" : "Low"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Student Status</span>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose This Job */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Why Choose This Job?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Verified student profile</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Competitive hourly rate</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Clear learning objectives</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Flexible scheduling options</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
