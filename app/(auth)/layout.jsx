"use client"

import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function AuthLayout({ children }) {
  const { user, profile, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/')
      return
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  // Render children if user is authenticated
  return <>{children}</>
}
