"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { getUserConversations, getConversationMessages, sendMessage, markNotificationAsRead } from "@/lib/supabaseAPI"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Send,
  User,
  Phone,
  Mail,
  MoreVertical,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Clock,
  MapPin,
  Star,
  MessageCircle,
  Copy,
  Shield,
  CheckCircle,
  X
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function MessageThreadPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useUser()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [relatedRequest, setRelatedRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const messagesEndRef = useRef(null)

  const otherUserId = params.id

  useEffect(() => {
    if (profile?.id && otherUserId) {
      fetchConversation()
      const cleanup = setupRealtimeSubscription()
      return cleanup
    }
  }, [profile?.id, otherUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversation = async () => {
    if (!profile?.id) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Get messages directly for this conversation
      const messagesResult = await getConversationMessages(profile.id, otherUserId)
      
      if (messagesResult.error) {
        throw new Error(messagesResult.error.message || 'Failed to fetch conversation')
      }

      const conversationMessages = messagesResult.data || []
      
      // Get user info from first message if available, or create a placeholder
      let otherUserInfo = { id: otherUserId, name: 'User', avatar_url: null, email: null, phone: null }
      
      if (conversationMessages.length > 0) {
        const firstMessage = conversationMessages[0]
        const otherUser = firstMessage.sender_id === profile.id 
          ? firstMessage.recipient 
          : firstMessage.sender
        
        otherUserInfo = {
          id: otherUser?.id || otherUserId,
          name: otherUser?.name || 'User',
          avatar_url: otherUser?.avatar_url || null,
          email: otherUser?.email || null,
          phone: otherUser?.phone_number || null
        }
      }

      // Set conversation data
      setConversation({
        user: otherUserInfo,
        messages: conversationMessages,
        lastMessage: conversationMessages[conversationMessages.length - 1] || null,
        unreadCount: conversationMessages.filter(msg => !msg.read && msg.recipient_id === profile.id).length
      })
      
      setMessages(conversationMessages)
      
      // Get related request if any message has a request_id
      const messageWithRequest = conversationMessages.find(msg => msg.request_id)
      if (messageWithRequest) {
        try {
          const { data: requestData, error: requestError } = await supabase
            .from('requests')
            .select(`
              *,
              subjects:request_subjects(subject:subjects(*))
            `)
            .eq('id', messageWithRequest.request_id)
            .single()
          
          if (!requestError && requestData) {
            setRelatedRequest(requestData)
          }
        } catch (err) {
          console.error('Error fetching related request:', err)
        }
      }
      
      console.log('Conversation messages loaded:', {
        count: conversationMessages.length,
        messages: conversationMessages.map(m => ({
          id: m.id,
          sender_id: m.sender_id,
          content: m.content.substring(0, 20) + '...',
          created_at: m.created_at
        })),
        currentUserId: profile.id
      })
      
      // Mark messages as read
      await markMessagesAsRead(conversationMessages)
    } catch (err) {
      console.error('Error fetching conversation:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsRead = async (messages) => {
    if (!messages || !profile?.id) return
    
    const unreadMessages = messages.filter(msg => 
      !msg.read && msg.recipient_id === profile.id
    )
    
    for (const message of unreadMessages) {
      try {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', message.id)
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    }
  }

  const setupRealtimeSubscription = () => {
    if (!profile?.id) return

    console.log('Setting up realtime subscription for user:', profile.id, 'other user:', otherUserId)

    const subscription = supabase
      .channel(`messages_${profile.id}_${otherUserId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or(and(sender_id.eq.${profile.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${profile.id}))`
      }, (payload) => {
        console.log('Realtime event received:', payload)
        
        if (payload.eventType === 'INSERT') {
          // Add new message at the end (chronological order)
          const newMessage = payload.new
          console.log('Adding new message:', newMessage)
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === newMessage.id)
            if (exists) {
              console.log('Message already exists, skipping')
              return prev
            }
            console.log('Adding message to state')
            return [...prev, newMessage]
          })
        } else if (payload.eventType === 'UPDATE') {
          console.log('Updating message:', payload.new)
          setMessages(prev => prev.map(msg => 
            msg.id === payload.new.id ? payload.new : msg
          ))
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      console.log('Cleaning up realtime subscription')
      subscription.unsubscribe()
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending || !profile?.id) return
    
    setSending(true)
    
    try {
      const messageData = {
        sender_id: profile.id,
        recipient_id: otherUserId,
        content: newMessage.trim()
      }
      
      console.log('Sending message:', messageData)
      
      const result = await sendMessage(messageData)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to send message')
      }
      
      console.log('Message sent successfully:', result.data)
      
      // Add the message optimistically to the UI
      if (result.data) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === result.data.id)
          if (!exists) {
            return [...prev, result.data]
          }
          return prev
        })
      }
      
      setNewMessage("")
      // The message will also be added via the realtime subscription
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCopyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log(`${type} copied to clipboard`)
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  const handleOpenEmail = () => {
    if (conversation?.user?.email) {
      window.open(`mailto:${conversation.user.email}`)
    }
  }

  const handleOpenWhatsApp = () => {
    if (conversation?.user?.phone) {
      const cleanPhone = conversation.user.phone.replace(/\D/g, '')
      window.open(`https://wa.me/${cleanPhone}`)
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg animate-pulse ${
                  i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'
                }`}>
                  <div className="w-32 h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conversation not found
          </h3>
          <p className="text-gray-500 mb-4">
            This conversation doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.created_at)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Enhanced Header with User Info */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Header */}
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Avatar className="w-12 h-12">
              <AvatarImage src={conversation.user.avatar_url} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="font-semibold text-gray-900 text-lg">
                {conversation.user.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
                {relatedRequest && (
                  <>
                    <span>•</span>
                    <BookOpen className="h-3 w-3" />
                    <span>Related to request</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => setShowContactModal(true)}
              >
                <User className="h-4 w-4 mr-1" />
                View Contact
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Request Information Panel */}
          {relatedRequest && (
            <div className="border-t border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Related Request</span>
                    <Badge variant="secondary" className="text-xs">
                      {relatedRequest.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {relatedRequest.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {relatedRequest.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{relatedRequest.subjects?.map(s => s.subject.name).join(', ') || 'No subjects'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{relatedRequest.price_currency_symbol}{relatedRequest.price_amount}</span>
                      <span>/ {relatedRequest.price_option}</span>
                    </div>
                    {relatedRequest.type && (
                      <Badge variant="outline" className="text-xs">
                        {relatedRequest.type}
                      </Badge>
                    )}
                  </div>
                </div>
                <Link 
                  href={`/tutor-jobs/${relatedRequest.id}`}
                  className="ml-4"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Request
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchConversation} 
              className="ml-2"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start the conversation
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {relatedRequest ? 
                  `Send a message about "${relatedRequest.title}" to get started.` :
                  "No messages yet. Send a message to start chatting!"
                }
              </p>
              {relatedRequest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">About this request</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    {relatedRequest.description?.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                <div key={date}>
                  {/* Enhanced Date separator */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-white border border-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full shadow-sm">
                      {date}
                    </div>
                  </div>

                  {/* Messages for this date */}
                  <div className="space-y-3">
                    {dayMessages.map((message, index) => {
                      const isCurrentUser = message.sender_id === profile?.id
                      const showAvatar = index === 0 || dayMessages[index - 1].sender_id !== message.sender_id
                      const showTime = index === dayMessages.length - 1 || 
                        dayMessages[index + 1].sender_id !== message.sender_id ||
                        new Date(dayMessages[index + 1].created_at) - new Date(message.created_at) > 300000 // 5 minutes
                      
                      return (
                        <div key={message.id} className={`flex items-end gap-2 ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          {!isCurrentUser && (
                            <div className="w-7 h-7 mb-1">
                              {showAvatar && (
                                <Avatar className="w-7 h-7">
                                  <AvatarImage src={conversation.user.avatar_url} />
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                    {conversation.user.name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          )}
                          
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isCurrentUser 
                              ? 'bg-blue-600 text-white rounded-br-md' 
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                            {showTime && (
                              <div className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.created_at)}
                              </div>
                            )}
                          </div>
                          
                          {isCurrentUser && (
                            <div className="w-7 h-7 mb-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Message Input */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto p-4">
          {/* Quick Actions Bar (if related request exists) */}
          {relatedRequest && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">Quick actions:</span>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Share contact info
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Schedule meeting
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Send proposal
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-2xl pr-12 py-3"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
                disabled={sending}
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                {newMessage.length}/1000
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending}
              className="rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {sending && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Sending...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Contact Information
            </DialogTitle>
            <DialogDescription>
              Here are the contact details for {conversation?.user?.name || 'this user'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* User Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                User Information
              </h4>
              <p className="text-gray-700">
                <strong>Name:</strong> {conversation?.user?.name || 'User Name'}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-3">
              {/* Email */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Email</span>
                    <Shield className="w-4 h-4 text-green-500" title="Verified Contact" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(conversation?.user?.email || '', 'Email')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="font-mono text-sm p-2 rounded text-gray-700 bg-gray-50">
                  {conversation?.user?.email || 'No email available'}
                </p>
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleOpenEmail}
                  disabled={!conversation?.user?.email}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>

              {/* Phone/WhatsApp */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="font-medium">WhatsApp</span>
                    <CheckCircle className="w-4 h-4 text-green-500" title="Verified Phone" />
                    <Shield className="w-4 h-4 text-green-500" title="Verified Contact" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(conversation?.user?.phone || '', 'Phone number')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="font-mono text-sm p-2 rounded text-gray-700 bg-gray-50">
                  {conversation?.user?.phone || 'No phone number available'}
                </p>
                <Button
                  size="sm"
                  className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  onClick={handleOpenWhatsApp}
                  disabled={!conversation?.user?.phone}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open WhatsApp
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowContactModal(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
