"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MessageCircle, 
  X, 
  Send, 
  AlertTriangle, 
  Lightbulb, 
  Heart,
  Flag,
  ChevronRight,
  Mail,
  CheckCircle
} from "lucide-react"

const FeedbackTypes = {
  COMPLAINT: {
    id: 'complaint',
    label: 'Lodge Complaint',
    icon: AlertTriangle,
    color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    description: 'Report issues or problems'
  },
  SUGGESTION: {
    id: 'suggestion', 
    label: 'Suggest Improvement',
    icon: Lightbulb,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    description: 'Share ideas to make us better'
  },
  LOVE: {
    id: 'love',
    label: 'Spread Love',
    icon: Heart,
    color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    description: 'Share positive feedback'
  },
  REQUEST_COMPLAINT: {
    id: 'request-complaint',
    label: 'Report Request',
    icon: Flag,
    color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    description: 'Report specific request issues'
  }
}

export default function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData] = useState({
    message: '',
    requestId: '',
    userEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setFormData({ message: '', requestId: '', userEmail: '' })
    setError('')
    setIsSubmitted(false)
  }

  const handleBack = () => {
    setSelectedType(null)
    setFormData({ message: '', requestId: '', userEmail: '' })
    setError('')
    setIsSubmitted(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.message.trim()) {
      setError('Please enter your message')
      return
    }

    if (selectedType.id === 'request-complaint' && !formData.requestId.trim()) {
      setError('Please enter the request ID you want to report')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType.label,
          message: formData.message,
          requestId: formData.requestId,
          userEmail: formData.userEmail,
          timestamp: new Date().toLocaleString(),
          currentPage: window.location.href,
          userAgent: navigator.userAgent
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send feedback')
      }

      // Show success state
      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsOpen(false)
        setSelectedType(null)
        setFormData({ message: '', requestId: '', userEmail: '' })
        setIsSubmitted(false)
      }, 3000)

    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError(err.message || 'Failed to send feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-lg border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
            <p className="text-sm text-green-700">
              Your feedback has been sent. We appreciate you taking the time to help us improve!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="w-80 shadow-xl border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedType ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBack}
                        className="p-1 h-6 w-6"
                      >
                        ←
                      </Button>
                      <selectedType.icon className="w-5 h-5" />
                      {selectedType.label}
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Feedback
                    </>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {selectedType ? selectedType.description : "How can we help you today?"}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {!selectedType ? (
              <div className="space-y-3">
                {Object.values(FeedbackTypes).map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant="outline"
                      className={`w-full justify-between text-left h-auto p-4 ${type.color}`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs opacity-75">{type.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )
                })}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedType.id === 'request-complaint' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request ID *
                    </label>
                    <Input
                      placeholder="Enter the request ID to report"
                      value={formData.requestId}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        requestId: e.target.value
                      }))}
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.userEmail}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      userEmail: e.target.value
                    }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include your email if you want a response
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    placeholder={
                      selectedType.id === 'complaint' ? "Describe the issue you're experiencing..." :
                      selectedType.id === 'suggestion' ? "Share your improvement idea..." :
                      selectedType.id === 'love' ? "Tell us what you love about the platform..." :
                      "Describe the problem with this request..."
                    }
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      message: e.target.value
                    }))}
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  <Mail className="w-3 h-3 inline mr-1" />
                    We share this email with founders like us
                  <div className="text-gray-400 mt-1">Powered by LittleNinjas18</div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
