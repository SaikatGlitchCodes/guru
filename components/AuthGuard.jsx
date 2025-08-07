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
  '/profile': { roles: ['student', 'tutor', 'admin'] },
  '/admin': { roles: ['admin'] },
  '/': { roles: ['student', 'tutor', 'admin', 'guest'] },
  '/tutor-jobs': { roles: ['student', 'tutor', 'admin', 'guest'] },
  '/become-tutor': { roles: ['student', 'tutor', 'admin', 'guest'] },
  '/request-tutor': { roles: ['student', 'admin', 'guest'] },
};

export default function AuthGuard({ children }) {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (loading) {
        return;
      }

      const routeConfig = findRouteConfig(pathname)
      
      // Allow access to routes without specific permissions or guest-accessible routes
      if (!routeConfig || (routeConfig.roles.includes('guest') && !user)) {
        setAuthorized(true)
        return
      }
      
      // For routes that require authentication, redirect to login if no user
      if (!user) {
        setAuthorized(false)
        // Don't redirect if already on a public page
        if (!routeConfig.roles.includes('guest')) {
          router.push('/') // Redirect to home instead of forward()
        }
        return
      }

      // If user exists but profile is still loading/null, wait a bit before making decisions
      const userRole = profile?.role || 'guest'
      
      // Give some time for profile to load before rejecting access
      if (!profile && user) {
        // Allow temporary access while profile loads
        setAuthorized(true)
        return
      }

      if (routeConfig.roles.includes(userRole)) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
        router.replace("/not-found")
      }
    }

    checkAuth()
  }, [user, profile, loading, pathname, router])

  // Helper function to find route config
  function findRouteConfig(path) {
    // Direct match first
    if (ROUTE_PERMISSIONS[path]) return ROUTE_PERMISSIONS[path]

    // Handle Next.js route groups by removing parentheses segments
    const cleanPath = path.replace(/\/\([^)]+\)/g, '')
    if (ROUTE_PERMISSIONS[cleanPath]) return ROUTE_PERMISSIONS[cleanPath]

    // Check for parent paths
    const segments = path.split('/').filter(Boolean)
    while (segments.length > 0) {
      const parentPath = '/' + segments.join('/')
      const cleanParentPath = parentPath.replace(/\/\([^)]+\)/g, '')
      
      if (ROUTE_PERMISSIONS[parentPath]) return ROUTE_PERMISSIONS[parentPath]
      if (ROUTE_PERMISSIONS[cleanParentPath]) return ROUTE_PERMISSIONS[cleanParentPath]
      
      segments.pop()
    }

    // Check specific paths that might be in route groups
    if (path.includes('/profile')) return ROUTE_PERMISSIONS['/profile']
    if (path.includes('/messages')) return ROUTE_PERMISSIONS['/messages']
    if (path.includes('/requests')) return ROUTE_PERMISSIONS['/requests']

    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Return children only when authorized
  return authorized ? <>
    {children}
  </> : null
}