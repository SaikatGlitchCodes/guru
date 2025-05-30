"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, Settings, Coins } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AuthModal from "./auth-modal"
import { useUser } from "@/contexts/UserContext"
import { Skeleton } from "@/components/ui/skeleton"

export default function Navbar() {
  const { user, profile, loading, signOut } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [previousProfile, setPreviousProfile] = useState(null)
  
  // Keep track of previous profile to prevent flashing during navigation
  useEffect(() => {
    if (profile && !loading) {
      setPreviousProfile(profile)
    }
  }, [profile, loading])
  
  // Use previous profile during loading if available
  const activeProfile = loading && previousProfile ? previousProfile : profile
  const isLoggedIn = loading ? !!previousProfile : !!user
  const userRole = activeProfile?.role || "guest"
  const userName = activeProfile?.name || "User"
  const coinBalance = activeProfile?.coin_balance || 0

  const getNavigationLinks = () => {
    switch (userRole) {
      case "student":
        return [
          { href: "/requests", label: "My Requests" },
          { href: "/find-tutors", label: "Find Tutors" },
          { href: "/messages", label: "Messages" },
          { href: '/job-support', label: "Job Support" },
        ]
      case "tutor":
        return [
          { href: "/tutor-jobs", label: "Open Requests" },
          { href: "/my-students", label: "My Students" },
          { href: "/earnings", label: "Earnings" },
          { href: "/messages", label: "Messages" },
        ]
      case "guest":
        return [
          { href: "/find-tutors", label: "Find Tutors" },
          { href: "/tutor-jobs", label: "Tutor Jobs" },
          { href: "/become-tutor", label: "Become a Tutor" },
          { href: '/job-support', label: "Job Support" },
        ]
      default:
        return []
    }
  }

  const navigationLinks = getNavigationLinks()

  const Logo = () => (
    <Link href="/" className="flex items-center space-x-2">
      <img className=" w-28" src="/logo.png" alt="MentorHub Logo"  />
    </Link>
  )

  const CoinBalance = () => (
    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
      <Coins className="w-4 h-4 text-yellow-600" />
      <span className="text-sm font-semibold text-yellow-700">
        {loading && !previousProfile ? (
          <Skeleton className="w-6 h-4 bg-yellow-100" />
        ) : (
          `${coinBalance} Coins`
        )}
      </span>
    </div>
  )

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          {loading && !previousProfile ? (
            <Skeleton className="h-10 w-96 rounded-full bg-gray-500" />
          ) : (
            <Avatar className="h-10 w-10 ring-2 ring-teal-100">
              <AvatarImage src={""} alt={userName} />
              <AvatarFallback className="bg-teal-500 text-white">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userName}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {userRole === "student" ? "Student" : "Tutor"}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {isLoggedIn && (
            <div className="flex items-center space-x-3 p-4 bg-gray-500 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={ ""} alt={userName} />
                <AvatarFallback className="bg-black text-white">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-gray-600">{userRole === "student" ? "Student" : " Tutor"}</p>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex justify-center">
              <CoinBalance />
            </div>
          )}

          <nav className="flex flex-col space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!isLoggedIn && (
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <AuthModal />
            </div>
          )}

          {isLoggedIn && (
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Link
                href="/profile"
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center text-left"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  // Use signOut when user clicks logout
  const handleLogout = async () => {
    console.log("Logging out user:", user?.email)
    await signOut()
    setPreviousProfile(null) // Clear previous profile data on logout
  }

  // Show a simplified navbar during first load with no previous state
  if (loading && !previousProfile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-4">
              <Skeleton className="w-24 h-8 rounded-md" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-teal-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <CoinBalance />
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <AuthModal />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
