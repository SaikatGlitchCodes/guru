"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export default function AutoProfileRedirect() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if:
    // 1. Not loading
    // 2. User is authenticated
    // 3. Currently on the homepage
    // 4. Profile exists (to avoid redirecting before profile loads)
    if (!loading && user && pathname === '/' && profile) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        router.push('/profile')
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [user, profile, loading, pathname, router])

  // This component doesn't render anything
  return null
}
