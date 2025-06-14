"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, Settings, Coins, Loader2 } from "lucide-react"
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
  const { user, profile, loading, profileLoading, signOut } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  // Show loading state if still fetching profile data
  const isProfileLoading = !!user && profileLoading

  // Determine login state and user info
  const isLoggedIn = !!user
  const userRole = profile?.role || "guest"
  const userName = profile?.name || user?.email?.split('@')[0] || "User"
  const coinBalance = profile?.coin_balance || 0

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
      <img className="w-28" src="/logo.png" alt="MentorHub Logo" />
    </Link>
  )

  const CoinBalance = () => {
    if( coinBalance >= 1 ){
      return (
        <Link href="/wallet" className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-black" />
          <span className="text-sm text-gray-700">{coinBalance} Coins</span>
        </Link>
      )
    }
    return (<button type="button" className="coin-button">
      <span className="fold"></span>

      <div className="points_wrapper">
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
        <i className="point"></i>
      </div>

      <span className="inner"
      >
        <svg
        className="icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      >
          <polyline
            points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
          >
            </polyline>
            </svg>
            
            {coinBalance} Coins
            </span>
    </button>)
  }

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          {isProfileLoading ? (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
          ) : (
            <Avatar className="h-10 w-10 ring-2 ring-gray-100">
              <AvatarImage src={profile?.avatar_url || ""} alt={userName} />
              <AvatarFallback className="bg-black text-white">
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
            {isProfileLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p className="font-medium">{userName}</p>
            )}
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {isProfileLoading ? (
                <Skeleton className="h-3 w-20" />
              ) : (
                userRole === "student" ? "Student" : "Tutor"
              )}
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

  // Mobile menu components and other functions remain unchanged...
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
          </div>

          {isLoggedIn && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              {isProfileLoading ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile?.avatar_url || ""} alt={userName} />
                  <AvatarFallback className="bg-black text-white">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                {isProfileLoading ? (
                  <>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-600">
                      {userRole === "student" ? "Student" : "Tutor"}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="px-4">
              <Link href="/request-tutor">
              <button className="request-button">
                 Request Guru
              </button>
            </Link>
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
  }

  // Show a simplified navbar during loading
  if (loading && !user) {
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

  // Rest of the component remains unchanged
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
            <Link href="/request-tutor">
              <button className="request-button">
                 Request Guru
              </button>
            </Link>
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