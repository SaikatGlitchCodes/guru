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

  useEffect(() => {
    const checkAuth = () => {
      if (loading) {
        return;
      }

      const routeConfig = findRouteConfig(pathname)
      if (!routeConfig || (routeConfig.roles.includes('guest') && !user)) {
        setAuthorized(true)
        return
      }
      if (!user) {
        setAuthorized(false)
        router.forward()
        return
      }

      const userRole = profile?.role || 'guest'
      if (!userRole) {
        setAuthorized(false)
        router.replace("/not-found")
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
    if (ROUTE_PERMISSIONS[path]) return ROUTE_PERMISSIONS[path]

    // Check for parent paths
    const segments = path.split('/').filter(Boolean)
    while (segments.length > 0) {
      const parentPath = '/' + segments.join('/')
      if (ROUTE_PERMISSIONS[parentPath]) return ROUTE_PERMISSIONS[parentPath]
      segments.pop()
    }

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
  return authorized ? children : null
}