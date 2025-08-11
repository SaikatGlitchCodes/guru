"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowLeft, Coins, Loader2 } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import Link from "next/link"

export default function PaymentStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, refreshUserData } = useUser()
  
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  
  const sessionId = searchParams.get('session_id')
  const status = searchParams.get('status') || 'processing'
  const coins = searchParams.get('coins')

  useEffect(() => {
    if (sessionId) {
      verifyPayment()
    } else {
      // Handle URL params from old success/cancel redirects
      const urlStatus = searchParams.get('payment')
      if (urlStatus === 'success' || urlStatus === 'cancelled') {
        setPaymentData({
          status: urlStatus === 'success' ? 'succeeded' : 'cancelled',
          coins: coins ? parseInt(coins) : 0,
          session_id: null
        })
        setLoading(false)
        
        // Refresh user data to get updated coin balance
        if (urlStatus === 'success') {
          setTimeout(() => refreshUserData(), 1000)
        }
      } else {
        setPaymentData({ status: 'unknown' })
        setLoading(false)
      }
    }
  }, [sessionId, searchParams])

  const verifyPayment = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      const data = await response.json()
      setPaymentData(data)
      
      // Refresh user data to get updated coin balance
      if (data.status === 'succeeded') {
        setTimeout(() => refreshUserData(), 1000)
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setPaymentData({ 
        status: 'error', 
        error: error.message 
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-12 h-12 text-red-500" />
      case 'processing':
        return <Clock className="w-12 h-12 text-yellow-500" />
      default:
        return <XCircle className="w-12 h-12 text-gray-500" />
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'succeeded':
        return {
          title: 'Payment Successful!',
          description: 'Your coins have been added to your wallet.',
          color: 'text-green-600'
        }
      case 'cancelled':
        return {
          title: 'Payment Cancelled',
          description: 'Your payment was cancelled. No charges were made.',
          color: 'text-yellow-600'
        }
      case 'failed':
        return {
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          color: 'text-red-600'
        }
      case 'processing':
        return {
          title: 'Processing Payment',
          description: 'Please wait while we process your payment...',
          color: 'text-yellow-600'
        }
      default:
        return {
          title: 'Unknown Status',
          description: 'We could not determine the payment status.',
          color: 'text-gray-600'
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 text-center">
              Please wait while we verify your payment status...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusMessage(paymentData?.status || 'unknown')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon(paymentData?.status)}
          </div>
          <CardTitle className={`text-2xl ${statusInfo.color}`}>
            {statusInfo.title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {statusInfo.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                {paymentData.coins && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coins Purchased:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      {paymentData.coins}
                    </span>
                  </div>
                )}
                {paymentData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium">${(paymentData.amount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={
                    paymentData.status === 'succeeded' ? 'default' : 
                    paymentData.status === 'cancelled' ? 'secondary' : 'destructive'
                  }>
                    {paymentData.status}
                  </Badge>
                </div>
                {paymentData.session_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentData.session_id.slice(-12)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current Coin Balance */}
          {profile && paymentData?.status === 'succeeded' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-blue-800">Your Wallet</h3>
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Coins className="w-6 h-6" />
                <span className="text-2xl font-bold">{profile.coin_balance || 0}</span>
                <span>Coins</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {paymentData?.status === 'succeeded' && (
              <Link href="/profile">
                <Button className="w-full">
                  View Wallet
                </Button>
              </Link>
            )}
            
            {(paymentData?.status === 'failed' || paymentData?.status === 'cancelled') && (
              <Button 
                onClick={() => router.push('/profile')}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            )}
            
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
