"use client"
import { Button } from "@/components/ui/button"

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading request details...</p>
      </div>
    </div>
  )
}

export function NotFoundState({ onGoBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request not found</h2>
        <p className="text-gray-600 mb-4">The request you're looking for doesn't exist.</p>
        <Button onClick={onGoBack}>Go Back</Button>
      </div>
    </div>
  )
}
