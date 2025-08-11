"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Users } from "lucide-react"

export default function RequestHeader({ request, onGoBack }) {
  if (!request) return null

  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              {request.view_count || 0} views
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {request.contacted_count || 0} applied
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
