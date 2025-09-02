"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Calendar, BookOpen, Settings, User } from "lucide-react"
import Link from "next/link"

export default function ProfileDashboard() {
  const { user, profile, loading } = useUser()

  // Don't show if not authenticated or still loading
  if (!user || loading || !profile) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {profile.name?.split(" ").map(n => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile.name}! 🎉</h1>
            <p className="text-muted-foreground">
              {profile.role === 'student' ? 'Ready to learn something new?' : 
               profile.role === 'tutor' ? 'Ready to share your knowledge?' : 
               'Welcome to your dashboard'}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
              {profile.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{profile.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Profile Completion */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.profile_completion_percentage || 0}%</div>
            <p className="text-xs text-muted-foreground">Complete</p>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="mt-2">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
            <Link href="/messages">
              <Button variant="outline" size="sm" className="mt-2">
                View Messages
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions based on role */}
        {profile.role === 'student' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Find Tutors</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Discover qualified tutors for your subjects
              </p>
              <Link href="/find-tutors">
                <Button size="sm" className="w-full">
                  Browse Tutors
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : profile.role === 'tutor' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tutor Jobs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Find new students and tutoring opportunities
              </p>
              <Link href="/tutor-jobs">
                <Button size="sm" className="w-full">
                  View Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Get Started</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Choose your role to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity or Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.role === 'student' && (
              <>
                <Link href="/request-tutor">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Request a Tutor
                  </Button>
                </Link>
                <Link href="/find-tutors">
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Browse Tutors
                  </Button>
                </Link>
              </>
            )}
            {profile.role === 'tutor' && (
              <>
                <Link href="/tutor-jobs">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Available Jobs
                  </Button>
                </Link>
                <Link href="/my-students">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    My Students
                  </Button>
                </Link>
              </>
            )}
            <Link href="/messages">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Your account details at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={profile.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {profile.status}
              </Badge>
            </div>
            {profile.coin_balance !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Coin Balance</span>
                <span className="text-sm font-medium">{profile.coin_balance}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
