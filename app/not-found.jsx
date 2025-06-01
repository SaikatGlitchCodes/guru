"use client"

import Link from "next/link"
import { useUser } from "@/contexts/UserContext"
import EasterEgg from "@/components/easter-egg"

export default function NotFound() {
  const { user, profile } = useUser()
  const userRole = profile?.role || "guest"

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist or you don't have permission to access it.</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition">
          Go to Home
        </Link>
        {user && (
          <Link href="/request-tutor" className="px-6 py-3 bg-black text-white rounded-md hover:bg-white hover:text-black transition">
            Create Request
          </Link>
        )}
      </div>

    </div>
  )
}