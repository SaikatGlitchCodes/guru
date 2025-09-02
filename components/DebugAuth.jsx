"use client"

import { useUser } from "@/contexts/UserContext"
import { usePathname } from "next/navigation"

export default function DebugAuth() {
  const { user, profile, loading } = useUser()
  const pathname = usePathname()

  // Only show in development
  if (process.env.NODE_ENV !== 'DEVELOPMENT') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs z-50">
      <div><strong>Route:</strong> {pathname}</div>
      <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
      <div><strong>User:</strong> {user ? 'Yes' : 'No'}</div>
      <div><strong>User ID:</strong> {user?.id || 'None'}</div>
      <div><strong>User Email:</strong> {user?.email || 'None'}</div>
      <div><strong>Profile:</strong> {profile ? 'Yes' : 'No'}</div>
      <div><strong>Profile ID:</strong> {profile?.id || 'None'}</div>
      <div><strong>Role:</strong> {profile?.role || 'None'}</div>
    </div>
  )
}
