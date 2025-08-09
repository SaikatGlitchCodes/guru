"use client"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { calculateContactCost, getPopularityLevel, getUrgencyInfo } from "@/lib/contactPricing"
import { contactStudent, incrementRequestViewCount, getRequestById } from "@/lib/supabaseAPI"
import { toast } from "sonner"

export function useRequestDetailLogic() {
  const { id } = useParams()
  const router = useRouter()
  const { user, profile, refreshUserData } = useUser()
  
  // State management
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [hasContacted, setHasContacted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Fetch request data from API
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true)
        
        const result = await getRequestById(id, user?.email)
        
        if (result.error) {
          throw new Error(result.error.message || 'Failed to fetch request')
        }
        
        if (!result.data) {
          throw new Error('Request not found')
        }
        
        setRequest(result.data)
        
        // If user has already paid, show contact modal immediately
        if (result.data.hasAlreadyPaid) {
          setHasContacted(true)
          setShowContactModal(true)
        }
        
        // Increment view count
        await incrementRequestViewCount(id)
      } catch (error) {
        console.error("Error fetching request:", error)
        toast.error("Failed to load request details")
        setRequest(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRequest()
    }
  }, [id, user?.email])

  // Handle contact student action
  const handleContactStudent = useCallback(async () => {
    // Check if user is logged in first
    if (!user || !profile) {
      setShowAuthModal(true)
      return
    }

    // If already paid, just show the modal
    if (request?.hasAlreadyPaid) {
      setShowContactModal(true)
      return
    }

    const cost = calculateContactCost(request)
    
    // Enhanced validation with better error messages
    if (!profile.coin_balance || profile.coin_balance < cost) {
      toast.error(`Insufficient coins. You need ${cost} coins but only have ${profile.coin_balance || 0}. Please purchase more coins to continue.`, {
        duration: 5000,
        action: {
          label: "Buy Coins",
          onClick: () => {
            window.dispatchEvent(new CustomEvent('openWalletModal'));
          }
        }
      })
      return
    }

    setContacting(true)
    
    try {
      // Pre-validate request still exists and is contactable
      const requestCheck = await getRequestById(id, user.email)
      if (requestCheck.error) {
        throw new Error('Request no longer available or has been modified')
      }

      const result = await contactStudent(user.email, request.id, cost)
      
      if (result.error) {
        if (result.error.message.includes('insufficient')) {
          throw new Error('Insufficient coins. Your balance may have changed.')
        } else if (result.error.message.includes('already contacted')) {
          throw new Error('You have already contacted this student.')
        } else {
          throw new Error(result.error.message || 'Failed to contact student')
        }
      }
      
      // Refresh user data and update UI
      await refreshUserData()
      
      // Update request with contact info
      setRequest(prev => ({
        ...prev,
        hasAlreadyPaid: true,
        contactInfoAvailable: true,
        student_email: result.contactInfo?.email,
        student_phone: result.contactInfo?.phone
      }))
      
      setHasContacted(true)
      setShowContactModal(true)
      toast.success(`Contact initiated successfully! ${cost} coins deducted from your balance.`, {
        duration: 4000
      })
      
    } catch (error) {
      console.error('Contact error:', error)
      toast.error(error.message || "Failed to contact student. Please try again.", {
        duration: 5000
      })
      
      await refreshUserData()
    } finally {
      setContacting(false)
    }
  }, [id, user, profile, request, refreshUserData])

  // Utility functions
  const handleCopyToClipboard = useCallback((text, type) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }, [])

  const handleOpenWhatsApp = useCallback(() => {
    const phoneNumber = request?.contactInfoAvailable 
      ? request.student_phone?.replace(/\D/g, '')
      : null
    
    if (phoneNumber && phoneNumber !== 'Contact details available after payment') {
      window.open(`https://wa.me/${phoneNumber}`, '_blank')
    } else {
      toast.error("Phone number not available")
    }
  }, [request])

  const handleOpenEmail = useCallback(() => {
    const email = request?.contactInfoAvailable 
      ? request.student_email
      : null
      
    if (email && email !== 'Contact details available after payment') {
      window.open(`mailto:${email}`, '_blank')
    } else {
      toast.error("Email not available")
    }
  }, [request])

  // Computed values
  const urgencyInfo = getUrgencyInfo(request?.urgency || 'flexible')
  const popularityInfo = getPopularityLevel(request?.view_count || 0)
  const contactCost = calculateContactCost(request)
  const timeAgo = Math.floor((Date.now() - new Date(request?.created_at || Date.now()).getTime()) / (1000 * 60 * 60))
  const shouldShowRecommendation = (request?.contacted_count || 0) >= 4

  return {
    // State
    request,
    loading,
    contacting,
    showContactModal,
    hasContacted,
    showAuthModal,
    
    // Computed values
    urgencyInfo,
    popularityInfo,
    contactCost,
    timeAgo,
    shouldShowRecommendation,
    
    // User data
    user,
    profile,
    
    // Actions
    handleContactStudent,
    handleCopyToClipboard,
    handleOpenWhatsApp,
    handleOpenEmail,
    setShowContactModal,
    setShowAuthModal,
    
    // Navigation
    router
  }
}
