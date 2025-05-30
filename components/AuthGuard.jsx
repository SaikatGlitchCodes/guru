"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

const ROUTE_PERMISSIONS = {
  '/requests': { roles: ['student', 'admin'] },
  '/find-tutors': { roles: ['student', 'admin', 'guest'] },
  '/messages': { roles: ['student', 'tutor', 'admin'] },
  '/job-support': { roles: ['student', 'tutor', 'admin', 'guest'] },
  '/my-students': { roles: ['tutor', 'admin'] },
  '/earnings': { roles: ['tutor', 'admin'] },
  '/profile': { roles: ['student', 'tutor', 'admin'] },
  '/admin': { roles: ['admin'] },
  '/': { roles: ['student', 'tutor', 'admin', 'guest'] },
  '/tutor-jobs': { roles: ['student', 'tutor', 'admin', 'guest'] },
  '/become-tutor': { roles: ['student', 'tutor', 'admin', 'guest'] },
};

export default function AuthGuard({ children }) {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  console.log("AuthGuard rendered for path:", pathname)

  useEffect(() => {
    const checkAuth = () => {
      if (loading) return

      const routeConfig = findRouteConfig(pathname)
        console.log("Checking route config for:", pathname, "->", routeConfig)
      
      // If route doesn't need protection or allows guests, authorize
      if (!routeConfig || (routeConfig.roles.includes('guest') && !user)) {
        setAuthorized(true)
        return
      }

      // Not logged in - redirect to login
      if (!user) {
        console.log("User not authenticated, redirecting to login")
        setAuthorized(false)
        // Store the intended URL to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", pathname)
        router.push("/")
        return
      }

      // Get user role
      const userRole = profile?.role
      if(!userRole){
        console.log("User profile role not found, redirecting to not-found")
        setAuthorized(false)
        router.push("/profile")
        return
      }
      
      // Check if user role has access to this route
      if (routeConfig.roles.includes(userRole)) {
        console.log(`Access granted to ${pathname} for ${userRole}`)
        setAuthorized(true)
      } else {
        console.log(`User role ${userRole} not allowed for route ${pathname}`)
        setAuthorized(false)
        router.push("/not-found")
      }
    }

    checkAuth()
  }, [user, profile, loading, pathname, router])

  // Helper function to find route config
  function findRouteConfig(path) {
    if (ROUTE_PERMISSIONS[path]) return ROUTE_PERMISSIONS[path]

    // Check for parent paths
    const segments = path.split('/').filter(Boolean)
    while (segments.length > 0) {
      const parentPath = '/' + segments.join('/')
      if (ROUTE_PERMISSIONS[parentPath]) return ROUTE_PERMISSIONS[parentPath]
      segments.pop()
    }

    // Default to no protection needed
    return null
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Return children only when authorized
  return authorized ? children : null
}