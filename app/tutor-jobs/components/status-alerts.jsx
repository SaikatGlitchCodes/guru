import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Briefcase } from "lucide-react"

export default function StatusAlerts({
  isJobSupportMode,
  error,
  onRefresh,
  onViewAllJobs
}) {
  return (
    <>
      {/* Job Support Mode Alert */}
      {isJobSupportMode && (
        <div className="mb-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Job Support Mode Active</AlertTitle>
            <AlertDescription className="text-blue-700 flex items-center justify-between">
              <span>
                Showing career mentoring and job support opportunities. Higher rates and professional networking await!
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onViewAllJobs}
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
              >
                View All Jobs
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
