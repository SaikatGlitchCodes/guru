import { Card, CardContent } from "@/components/ui/card"

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-2xl h-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Filters Skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Main Content Skeleton */}
          <div className="flex-1 space-y-6">
            {/* Results Header */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Tutor Cards Skeleton */}
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="w-full">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
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

          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-80">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                {[1, 2, 3, 4].map(section => (
                  <div key={section} className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map(item => (
                        <div key={item} className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
