"use client"

import { UserProvider } from "@/contexts/UserContext"
import AuthGuard from "@/components/AuthGuard"

export default function AuthProvider({ children, requireAuth = true }) {
  return (
    <UserProvider>
      {requireAuth ? <AuthGuard>{children}</AuthGuard> : children}
    </UserProvider>
  )
}