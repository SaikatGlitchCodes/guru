"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { getUserConversations } from "@/lib/supabaseAPI"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle,
  Search,
  User,
  Clock,
  AlertCircle,
  RefreshCw,
  Mail,
  Send
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ThemedHero from "@/components/ThemedHero"
import Link from "next/link"

export default function MessagesPage() {
  const { user, profile } = useUser()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchConversations()
    }
  }, [profile?.id])

  const fetchConversations = async () => {
    if (!profile?.id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await getUserConversations(profile.id)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch conversations')
      }
      
      setConversations(result.data || [])
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short' 
      })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ThemedHero>
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Messages</h1>
              <p className="text-xl text-gray-300">Your conversations</p>
            </div>
          </div>
        </ThemedHero>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHero>
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Messages</h1>
            <p className="text-xl text-gray-300">
              Your conversations ({conversations.length})
            </p>
          </div>

          {/* Search Bar */}
          {!loading && conversations.length > 0 && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>
          )}
        </div>
      </ThemedHero>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchConversations} 
                  className="ml-2"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Refresh Button */}
          {!loading && conversations.length > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredConversations.length} of {conversations.length} conversations
              </div>
              <Button 
                variant="outline" 
                onClick={fetchConversations}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          )}

          {conversations.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Messages Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven't started any conversations yet. Connect with tutors or students to begin messaging.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => window.location.href = '/find-tutors'}
                    className="w-full bg-black hover:bg-gray-800"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Tutors
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/tutor-jobs'}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Browse Tutoring Jobs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {filteredConversations.length === 0 && conversations.length > 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No conversations match your search
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria to find conversations.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <Link 
                key={conversation.user.id} 
                href={`/messages/${conversation.user.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.user.avatar_url} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.user.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(conversation.lastMessage?.created_at)}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                          </div>
                          
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="bg-blue-600">
                              {conversation.unreadCount} unread
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-400">
                        <Send className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
