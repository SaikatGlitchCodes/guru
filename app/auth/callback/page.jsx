"use client"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Mail, AlertCircle, Home } from 'lucide-react'
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

function AuthCallbackContent() {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle email verification
        const token = searchParams.get('token')
        const type = searchParams.get('type')
        const error = searchParams.get('error')
        const error_description = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(error_description || 'An authentication error occurred.')
          return
        }

        if (token && type) {
          if (type === 'signup') {
            // Handle email verification
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email'
            })

            if (error) {
              setStatus('error')
              setMessage('Email verification failed. The link may be expired or invalid.')
            } else {
              setStatus('success')
              setMessage('Email verified successfully! You can now sign in to your account.')
              toast.success('Email verified! Welcome to our platform.')
              
              // Redirect to home after a delay
              setTimeout(() => {
                router.push('/')
              }, 3000)
            }
          } else if (type === 'recovery') {
            // Handle password reset
            router.push(`/reset-password?token=${token}&type=${type}`)
            return
          } else {
            setStatus('error')
            setMessage('Unknown verification type.')
          }
        } else {
          // Check if user just signed in/up normally
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            setStatus('success')
            setMessage('Authentication successful! Redirecting...')
            
            // Check for pending request or custom redirect
            const redirectUrl = localStorage.getItem('redirectAfterAuth')
            if (redirectUrl) {
              localStorage.removeItem('redirectAfterAuth')
              // Ensure it's a relative path to prevent open redirect vulnerabilities
              if (redirectUrl.startsWith('/')) {
                router.push(redirectUrl)
              } else {
                router.push('/')
              }
            } else {
              router.push('/')
            }
          } else {
            setStatus('error')
            setMessage('No authentication session found.')
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred during authentication.')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-16 w-16 text-green-500" />
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'loading':
      default:
        return <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'loading':
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className={`w-full max-w-md ${getStatusColor()}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle>
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Error'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we process your request.'}
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <Mail className="h-4 w-4" />
                <span>You're all set! Redirecting you now...</span>
              </div>
              <Button 
                onClick={() => router.push('/')}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Please try again or contact support if the problem persists.</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-blue-200 bg-blue-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
            <CardTitle>Processing...</CardTitle>
            <CardDescription>Please wait while we process your request.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
