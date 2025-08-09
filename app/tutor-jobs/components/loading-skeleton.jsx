import { Card, CardContent } from "@/components/ui/card"

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
