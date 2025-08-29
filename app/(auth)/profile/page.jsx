"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Camera, Loader2, Star, MapPin, Locate, Search, X, Plus, Coins, Clock, DollarSign, Award, Languages, Calendar, Shield, CheckCircle, AlertTriangle } from "lucide-react"
import { usePageVisibility } from "@/lib/hooks/usePageVisibility"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { updateProfile, createProfile, getAllSubjects, getUserSubjects, addUserSubject, removeUserSubject } from "@/lib/supabaseAPI"
import { WalletModal } from "@/components/WalletModal"

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

// Base schema for all users
const baseUserSchema = {
  email: yup
    .string()
    .email("Please enter a valid email address format")
    .optional(),
  name: yup
    .string()
    .min(2, "Your name must contain at least 2 characters")
    .required("Please enter your name"),
  role: yup
    .string()
    .oneOf(["student", "tutor"], "Please select a valid role")
    .required("Please select your role"),
  phone_number: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  gender: yup
    .string()
    .optional(),
  bio: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  years_of_experience: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Experience years cannot be negative")
    .optional(),
  hobbies: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  status: yup
    .string()
    .oneOf(["active", "inactive", "ban"], "Invalid account status")
    .optional(),
  coin_balance: yup
    .number()
    .optional(),
  rating: yup
    .number()
    .optional(),
  total_reviews: yup
    .number()
    .optional(),
  timezone: yup
    .string()
    .optional(),
  preferred_language: yup
    .string()
    .optional(),
  profile_completion_percentage: yup
    .number()
    .optional(),
  email_verified: yup
    .boolean()
    .optional(),
  phone_verified: yup
    .boolean()
    .optional(),
  government_id_verified: yup
    .boolean()
    .optional(),
  address: yup.object({
    id: yup.string().nullable().optional(),
    street: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    zip: yup.string().optional(),
    country: yup.string().optional(),
    country_code: yup.string().optional(),
    lat: yup.number().nullable().optional(),
    lon: yup.number().nullable().optional(),
    address_line_1: yup.string().nullable().optional(),
    address_line_2: yup.string().nullable().optional(),
    formatted: yup.string().optional(),
  }).optional(),
}

// Tutor-specific schema
const tutorSchema = {
  ...baseUserSchema,
  tutor: yup.object({
    hourly_rate: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .min(0, "Hourly rate cannot be negative")
      .required("Please enter your hourly rate"),
    experience_years: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .min(0, "Experience years cannot be negative")
      .optional(),
    education: yup
      .string()
      .optional(),
    certifications: yup
      .array()
      .of(yup.string())
      .optional(),
    languages: yup
      .array()
      .of(yup.string())
      .optional(),
    teaching_style: yup
      .string()
      .optional(),
    specializations: yup
      .array()
      .of(yup.string())
      .optional(),
    response_time: yup
      .string()
      .optional(),
    availability_status: yup
      .string()
      .oneOf(['available', 'busy', 'away'], 'Invalid availability status')
      .optional(),
    verified: yup
      .boolean()
      .optional(),
    verification_documents: yup
      .array()
      .of(yup.string())
      .optional(),
    background_check: yup
      .boolean()
      .optional(),
    preferred_meeting_types: yup
      .array()
      .of(yup.string())
      .optional(),
    travel_radius_km: yup
      .number()
      .transform((value) => (isNaN(value) ? 10 : value))
      .min(0, "Travel radius cannot be negative")
      .optional(),
    minimum_session_duration: yup
      .number()
      .transform((value) => (isNaN(value) ? 60 : value))
      .min(15, "Minimum session duration must be at least 15 minutes")
      .optional(),
    cancellation_policy: yup
      .string()
      .optional(),
    instant_booking: yup
      .boolean()
      .optional(),
  }).optional(),
}

// Create dynamic schema based on role
const createProfileSchema = (role) => {
  if (role === 'tutor') {
    return yup.object(tutorSchema).required("Please complete the form")
  }
  return yup.object(baseUserSchema).required("Please complete the form")
}

export default function ProfilePage() {
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [addressSearchValue, setAddressSearchValue] = useState("")
  
  // Subjects state
  const [allSubjects, setAllSubjects] = useState([])
  const [userSubjects, setUserSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

  // Language management
  const [newLanguage, setNewLanguage] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")
  const [newCertification, setNewCertification] = useState("")
  
  const { profile, loading, uploadAvatarToSupabase, user, refreshUserData } = useUser()
  const { justBecameVisible } = usePageVisibility()
  const debounceRef = useRef(null)

  // Get current role from profile
  const currentRole = profile?.role || 'student'
  
  const form = useForm({
    resolver: yupResolver(createProfileSchema(currentRole)),
    defaultValues: profile,
    mode: "onChange",
  })

  useEffect(() => {
    if (profile) {
      console.log('Profile data received:', profile)
      const formattedAddress = profile.address
        ? `${addressSearchValue || profile.address.formatted || profile.address.street || ""} ${profile.address.city || ""} ${profile.address.state || ""} ${profile.address.zip || ""}`.trim()
        : ""

      // Create a properly structured form data object
      const formData = {
        email: profile.email || "",
        name: profile.name || "",
        role: profile.role || "student",
        phone_number: profile.phone_number || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
        years_of_experience: profile.years_of_experience || 0,
        hobbies: profile.hobbies || "",
        status: profile.status || "active",
        rating: profile.rating || 0,
        total_reviews: profile.total_reviews || 0,
        coin_balance: profile.coin_balance || 0,
        timezone: profile.timezone || "UTC",
        preferred_language: profile.preferred_language || "English",
        profile_completion_percentage: profile.profile_completion_percentage || 0,
        email_verified: profile.email_verified || false,
        phone_verified: profile.phone_verified || false,
        government_id_verified: profile.government_id_verified || false,
        address: {
          id: profile.address?.id || null,
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zip: profile.address?.zip || "",
          country: profile.address?.country || "",
          country_code: profile.address?.country_code || "",
          address_line_1: profile.address?.address_line_1 || "",
          address_line_2: profile.address?.address_line_2 || "",
          lat: profile.address?.lat || 0,
          lon: profile.address?.lon || 0,
          formatted: profile.address?.formatted || ""
        }
      }

      // Add tutor-specific data if user is a tutor
      if (profile.role === 'tutor' && profile.tutor) {
        formData.tutor = {
          hourly_rate: profile.tutor.hourly_rate || 0,
          experience_years: profile.tutor.experience_years || 0,
          education: profile.tutor.education || "",
          certifications: profile.tutor.certifications || [],
          languages: profile.tutor.languages || [],
          teaching_style: profile.tutor.teaching_style || "",
          specializations: profile.tutor.specializations || [],
          response_time: profile.tutor.response_time || "< 24 hours",
          availability_status: profile.tutor.availability_status || "available",
          verified: profile.tutor.verified || false,
          verification_documents: profile.tutor.verification_documents || [],
          background_check: profile.tutor.background_check || false,
          preferred_meeting_types: profile.tutor.preferred_meeting_types || [],
          travel_radius_km: profile.tutor.travel_radius_km || 10,
          minimum_session_duration: profile.tutor.minimum_session_duration || 60,
          cancellation_policy: profile.tutor.cancellation_policy || "",
          instant_booking: profile.tutor.instant_booking || false,
        }
      }
      
      console.log('Resetting form with data:', formData)
      form.reset(formData)
      if (formattedAddress) {
        setAddressSearchValue("")
      }
      if (profile.avatar_url) {
        setAvatar(profile.avatar_url)
      }

      // Load subjects
      loadSubjects()
      loadUserSubjects()
    }
  }, [profile])

  // Check for payment success/failure on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const paymentStatus = urlParams.get('payment')
      const coins = urlParams.get('coins')

      if (paymentStatus === 'success' && coins) {
        toast.success(`Payment successful! ${coins} coins have been added to your wallet.`)
        // Refresh profile to get updated coin balance
        refreshUserData()
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } else if (paymentStatus === 'cancelled') {
        toast.error('Payment was cancelled.')
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Load all available subjects
  const loadSubjects = async () => {
    try {
      const result = await getAllSubjects()
      if (result.data) {
        setAllSubjects(result.data)
      }
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  // Load user's subjects
  const loadUserSubjects = async () => {
    if (!profile?.email) return
    
    try {
      const result = await getUserSubjects(profile.email)
      if (result.data) {
        setUserSubjects(result.data)
      }
    } catch (error) {
      console.error('Error loading user subjects:', error)
    }
  }

  // Add subject to user
  const handleAddSubject = async () => {
    if (!selectedSubject || !profile?.email) return

    setIsLoadingSubjects(true)
    try {
      const result = await addUserSubject(profile.email, selectedSubject)
      if (result.data) {
        setUserSubjects(prev => [...prev, result.data])
        setSelectedSubject("")
        toast.success("Subject added successfully!")
      } else {
        toast.error("Failed to add subject")
      }
    } catch (error) {
      console.error('Error adding subject:', error)
      toast.error("Failed to add subject")
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Remove subject from user
  const handleRemoveSubject = async (subjectId) => {
    if (!profile?.email) return

    try {
      const result = await removeUserSubject(profile.email, subjectId)
      if (!result.error) {
        setUserSubjects(prev => prev.filter(us => us.subject_id !== subjectId))
        toast.success("Subject removed successfully!")
      } else {
        toast.error("Failed to remove subject")
      }
    } catch (error) {
      console.error('Error removing subject:', error)
      toast.error("Failed to remove subject")
    }
  }

  // Handle successful coin purchase
  const handleCoinPurchaseSuccess = async (coins) => {
    await refreshUserData() // Refresh profile to get updated coin balance
    toast.success(`${coins} coins added to your wallet!`)
  }

  // Helper functions for managing tutor arrays
  const addLanguage = () => {
    if (!newLanguage.trim()) return
    const currentLanguages = form.getValues('tutor.languages') || []
    if (!currentLanguages.includes(newLanguage.trim())) {
      form.setValue('tutor.languages', [...currentLanguages, newLanguage.trim()])
      setNewLanguage("")
    }
  }

  const removeLanguage = (language) => {
    const currentLanguages = form.getValues('tutor.languages') || []
    form.setValue('tutor.languages', currentLanguages.filter(l => l !== language))
  }

  const addSpecialization = () => {
    if (!newSpecialization.trim()) return
    const currentSpecs = form.getValues('tutor.specializations') || []
    if (!currentSpecs.includes(newSpecialization.trim())) {
      form.setValue('tutor.specializations', [...currentSpecs, newSpecialization.trim()])
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (spec) => {
    const currentSpecs = form.getValues('tutor.specializations') || []
    form.setValue('tutor.specializations', currentSpecs.filter(s => s !== spec))
  }

  const addCertification = () => {
    if (!newCertification.trim()) return
    const currentCerts = form.getValues('tutor.certifications') || []
    if (!currentCerts.includes(newCertification.trim())) {
      form.setValue('tutor.certifications', [...currentCerts, newCertification.trim()])
      setNewCertification("")
    }
  }

  const removeCertification = (cert) => {
    const currentCerts = form.getValues('tutor.certifications') || []
    form.setValue('tutor.certifications', currentCerts.filter(c => c !== cert))
  }

  const toggleMeetingType = (type) => {
    const currentTypes = form.getValues('tutor.preferred_meeting_types') || []
    if (currentTypes.includes(type)) {
      form.setValue('tutor.preferred_meeting_types', currentTypes.filter(t => t !== type))
    } else {
      form.setValue('tutor.preferred_meeting_types', [...currentTypes, type])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access your profile.</p>
        </div>
      </div>
    )
  }

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }, [])

  const reverseGeocode = async (latitude, longitude) => {
    if (!GEOAPIFY_API_KEY) {
      throw new Error('Geoapify API key is not configured')
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch address information')
      }

      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const feature = data.features[0]
        const props = feature.properties
        return {
          street: `${props.housenumber || ''} ${props.street || ''}`.trim(),
          city: props.city || props.town || props.village || '',
          state: props.state || props.region || '',
          zip: props.postcode || '',
          country: props.country || '',
          country_code: props.country_code || '',
          formatted: props.formatted || '',
          lat: latitude,
          lon: longitude
        }
      } else {
        throw new Error('No address found for the given coordinates')
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      throw error
    }
  }

  const searchAddresses = async (query) => {
    if (!GEOAPIFY_API_KEY || !query || query.length < 3) {
      return []
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${GEOAPIFY_API_KEY}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions')
      }

      const data = await response.json()

      if (data.features) {
        return data.features.map(feature => ({
          id: feature.properties.place_id,
          formatted: feature.properties.formatted,
          street: `${feature.properties.housenumber || ''} ${feature.properties.street || ''}`.trim(),
          city: feature.properties.city || feature.properties.town || feature.properties.village || '',
          state: feature.properties.state || feature.properties.region || '',
          zip: feature.properties.postcode || '',
          country: feature.properties.country || '',
          country_code: feature.properties.country_code || '',
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0]
        }))
      }

      return []
    } catch (error) {
      return []
    }
  }

  const debouncedAddressSearch = useCallback((query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoadingSuggestions(true)
        try {
          const suggestions = await searchAddresses(query)
          setAddressSuggestions(suggestions)
        } catch (error) {
          console.error('Search failed:', error)
          setAddressSuggestions([])
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setAddressSuggestions([])
      }
    }, 300)
  }, [])

  const handleAddressSearchChange = useCallback((value) => {
    setAddressSearchValue(value)
    setShowAddressSuggestions(true)
    debouncedAddressSearch(value)
  }, [debouncedAddressSearch])

  const handleAddressSelect = useCallback((selectedAddress) => {
    // Update form fields using the correct nested structure
    form.setValue('address.formatted', selectedAddress.formatted)
    form.setValue('address.street', addressSearchValue || selectedAddress.street || selectedAddress.formatted)
    form.setValue('address.city', selectedAddress.city)
    form.setValue('address.state', selectedAddress.state)
    form.setValue('address.zip', selectedAddress.zip)
    form.setValue('address.country', selectedAddress.country)
    form.setValue('address.country_code', selectedAddress.country_code)
    form.setValue('address.lat', selectedAddress.lat)
    form.setValue('address.lon', selectedAddress.lon)

    setAddressSearchValue(selectedAddress.formatted)
    setShowAddressSuggestions(false)
    setAddressSuggestions([])

    toast.success('Address selected successfully!')
  }, [form])

  const handleGetCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true)

    try {
      const coordinates = await getCurrentLocation()
      const addressInfo = await reverseGeocode(coordinates.latitude, coordinates.longitude)

      form.setValue('address.formatted', addressInfo.formatted)
      form.setValue('address.street', addressSearchValue || addressInfo.formatted)
      form.setValue('address.city', addressInfo.city)
      form.setValue('address.state', addressInfo.state)
      form.setValue('address.zip', addressInfo.zip)
      form.setValue('address.country', addressInfo.country)
      form.setValue('address.country_code', addressInfo.country_code)
      form.setValue('address.lat', addressInfo.lat)
      form.setValue('address.lon', addressInfo.lon)

      setAddressSearchValue(addressInfo.formatted)

      toast.success('Address updated successfully using your current location!')

    } catch (error) {
      console.error('Location error:', error)

      let errorMessage = 'Failed to get your location. '

      if (error.code === 1) {
        errorMessage += 'Please allow location access and try again.'
      } else if (error.code === 2) {
        errorMessage += 'Location information is unavailable.'
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out.'
      } else {
        errorMessage += error.message || 'Please try again.'
      }

      toast.error(errorMessage)
    } finally {
      setIsGettingLocation(false)
    }
  }, [getCurrentLocation, reverseGeocode, form])

  const clearAddressSearch = useCallback(() => {
    setAddressSearchValue("")
    setAddressSuggestions([])
    setShowAddressSuggestions(false)
  }, [form])

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large, Image must be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const uploadedUrl = await uploadAvatarToSupabase(file, profile.email)
      if (uploadedUrl) {
        setAvatar(uploadedUrl)
        form.setValue('avatar_url', uploadedUrl)
        toast.success("Avatar updated successfully!")
      }
    } catch (error) {
      console.error("Error handling avatar:", error)
      toast.error("Failed to process image")
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(data) {
    console.log('Form submission started with data:', data)
    setIsSaving(true)

    try {
      // Validate the form first
      const isValid = await form.trigger();
      console.log('Form validation result:', isValid)
      
      if (!isValid) {
        const errors = form.formState.errors;
        console.log('Form validation errors:', errors)
        
        // Display a more user-friendly error summary
        if (Object.keys(errors).length > 0) {
          // Get the first error message to show in the toast
          const firstErrorField = Object.keys(errors)[0];
          const firstError = errors[firstErrorField];
          const errorMessage = firstError?.message || 'Form validation failed';
          
          toast.error(`Please fix the form errors: ${errorMessage}`);
        }
        
        setIsSaving(false);
        return;
      }
      
      console.log('Calling updateProfile with:', data, profile.email)
      const result = await updateProfile(data, profile.email);
      console.log('Update result:', result)
      
      if (result.error) {
        throw new Error(result.error.message || result.error);
      }

      toast.success("Your profile has been updated successfully!")

    } catch (error) {
      console.error("Error saving profile:", error);
      
      // More descriptive error messages
      if (error.message.includes("network")) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else if (error.message.includes("permission")) {
        toast.error("You don't have permission to update this profile.");
      } else {
        toast.error(`Failed to update your profile: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-10 mx-auto px-3 lg:px-0">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {currentRole === 'tutor' ? 'Tutor Profile' : 'Student Profile'}
            </h1>
            <p className="text-muted-foreground">
              {currentRole === 'tutor' 
                ? 'Manage your teaching profile and professional information'
                : 'Manage your learning profile and account information'
              }
            </p>
          </div>
          <Badge variant={currentRole === 'tutor' ? 'default' : 'secondary'} className="text-sm">
            {currentRole === 'tutor' ? 'Tutor' : 'Student'}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Information Column */}
            <div className="space-y-6">
              {/* Basic Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        {isUploading ? (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src={avatar || ""} alt="Profile" />
                            <AvatarFallback className="bg-black text-white">
                              {profile?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Upload avatar</span>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.floor(form.watch('rating') || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted'
                            }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium">
                        {Number(form.watch('rating'))?.toFixed(1) || '0.0'} 
                        ({form.watch('total_reviews') || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <div className="flex items-center gap-2 text-sm">
                          {form.watch('email_verified') ? (
                            <><CheckCircle className="h-4 w-4 text-green-500" /> Verified</>
                          ) : (
                            <><AlertTriangle className="h-4 w-4 text-yellow-500" /> Unverified</>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <div className="flex items-center gap-2 text-sm">
                          {form.watch('phone_verified') ? (
                            <><CheckCircle className="h-4 w-4 text-green-500" /> Verified</>
                          ) : (
                            <><AlertTriangle className="h-4 w-4 text-yellow-500" /> Unverified</>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <FormControl>
                            <Input placeholder="UTC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="preferred_language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Portuguese">Portuguese</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                            <SelectItem value="Japanese">Japanese</SelectItem>
                            <SelectItem value="Korean">Korean</SelectItem>
                            <SelectItem value="Arabic">Arabic</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Russian">Russian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View your account status and balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                          <span className="text-xs font-bold text-yellow-900">$</span>
                        </div>
                        <p className="text-2xl font-bold">{form.watch('coin_balance') || 0}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsWalletModalOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Coins className="h-4 w-4" />
                        Buy Coins
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile Completion</span>
                      <span>{form.watch('profile_completion_percentage') || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${form.watch('profile_completion_percentage') || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange} disabled>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="ban">Banned</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Verification Status */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Verification Status</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        {form.watch('email_verified') ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        Email
                      </div>
                      <div className="flex items-center gap-2">
                        {form.watch('phone_verified') ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        Phone
                      </div>
                      <div className="flex items-center gap-2">
                        {form.watch('government_id_verified') ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        Government ID
                      </div>
                      {currentRole === 'tutor' && (
                        <div className="flex items-center gap-2">
                          {form.watch('tutor.background_check') ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          Background Check
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details & Role-Specific Column */}
            <div className="space-y-6">
              {/* Profile Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Share information about yourself with the community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={currentRole === 'tutor' 
                              ? "Tell students about your teaching philosophy and expertise..." 
                              : "Tell tutors about your learning goals and interests..."
                            } 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {currentRole === 'tutor' 
                            ? "Describe your teaching style and what makes you unique as a tutor." 
                            : "Describe what you're looking to learn and your academic goals."
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="years_of_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {currentRole === 'tutor' ? 'Years of Teaching Experience' : 'Years of Learning Experience'}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hobbies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hobbies & Interests</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your hobbies and interests..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tutor-Specific Information */}
              {currentRole === 'tutor' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Professional Information
                      </CardTitle>
                      <CardDescription>Set your rates and professional details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tutor.hourly_rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hourly Rate ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tutor.experience_years"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teaching Experience (years)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="tutor.education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education Background</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your educational background..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tutor.teaching_style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching Style</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your teaching approach and methodology..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        Languages & Specializations
                      </CardTitle>
                      <CardDescription>Manage your language skills and areas of expertise</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Languages */}
                      <div className="space-y-3">
                        <FormLabel>Languages Spoken</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a language"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                          />
                          <Button type="button" onClick={addLanguage} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.watch('tutor.languages') || []).map((language, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {language}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeLanguage(language)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="space-y-3">
                        <FormLabel>Specializations</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a specialization"
                            value={newSpecialization}
                            onChange={(e) => setNewSpecialization(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                          />
                          <Button type="button" onClick={addSpecialization} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.watch('tutor.specializations') || []).map((spec, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {spec}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeSpecialization(spec)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="space-y-3">
                        <FormLabel>Certifications</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a certification"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                          />
                          <Button type="button" onClick={addCertification} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.watch('tutor.certifications') || []).map((cert, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {cert}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeCertification(cert)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Availability & Preferences
                      </CardTitle>
                      <CardDescription>Set your availability and tutoring preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tutor.availability_status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="available">Available</SelectItem>
                                  <SelectItem value="busy">Busy</SelectItem>
                                  <SelectItem value="away">Away</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tutor.response_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Response Time</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="< 1 hour">Within 1 hour</SelectItem>
                                  <SelectItem value="< 4 hours">Within 4 hours</SelectItem>
                                  <SelectItem value="< 12 hours">Within 12 hours</SelectItem>
                                  <SelectItem value="< 24 hours">Within 24 hours</SelectItem>
                                  <SelectItem value="1-2 days">1-2 days</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tutor.minimum_session_duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Session Duration (minutes)</FormLabel>
                              <FormControl>
                                <Input type="number" min="15" step="15" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tutor.travel_radius_km"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Travel Radius (km)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Meeting Types */}
                      <div className="space-y-3">
                        <FormLabel>Preferred Meeting Types</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {['online', 'in_person', 'hybrid', 'group_sessions'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={(form.watch('tutor.preferred_meeting_types') || []).includes(type)}
                                onCheckedChange={() => toggleMeetingType(type)}
                              />
                              <label htmlFor={type} className="text-sm capitalize">
                                {type.replace('_', ' ')}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Instant Booking */}
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="tutor.instant_booking"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Enable Instant Booking
                                </FormLabel>
                                <FormDescription>
                                  Allow students to book sessions with you instantly
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="tutor.cancellation_policy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cancellation Policy</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your cancellation policy..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Address Information - Common for both roles */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Address Information</CardTitle>
                      <CardDescription>Update your address details</CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center gap-2"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Locate className="h-4 w-4" />
                      )}
                      {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Address Search with Autocomplete */}
                  <div className="space-y-2">
                    <FormLabel>Search Address</FormLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Start typing an address..."
                        value={addressSearchValue}
                        onChange={(e) => handleAddressSearchChange(e.target.value)}
                        onClick={() => setShowAddressSuggestions(true)}
                        className="pl-10 pr-10"
                      />
                      {addressSearchValue && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearAddressSearch}
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {showAddressSuggestions && addressSearchValue.length >= 3 && (
                      <div className="relative w-full mt-1 z-10 border rounded-md shadow-md bg-background">
                        {isLoadingSuggestions ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm text-muted-foreground">Searching address...</span>
                          </div>
                        ) : addressSuggestions.length > 0 ? (
                          <div className="max-h-60 overflow-auto">
                            {addressSuggestions.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                className="flex items-start p-2 cursor-pointer hover:bg-accent"
                                onClick={() => handleAddressSelect(suggestion)}
                              >
                                <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                                <div className="flex flex-col">
                                  <span className="font-medium">{suggestion.formatted}</span>
                                  {suggestion.city && suggestion.state && (
                                    <span className="text-xs text-muted-foreground">
                                      {suggestion.city}, {suggestion.state}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            No address found
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      Search and select your address from suggestions, or fill in manually below.
                    </p>
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address.zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hidden fields for coordinates and other address data */}
                  <FormField
                    control={form.control}
                    name="address.formatted"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.lat"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.lon"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Subjects - Common for both roles */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Subjects</CardTitle>
                  <CardDescription>
                    {currentRole === 'tutor' 
                      ? 'Manage subjects you can teach and your expertise level'
                      : 'Manage subjects you\'re interested in learning'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add new subject */}
                  <div className="flex gap-2">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a subject to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSubjects
                          .filter(subject => !userSubjects.some(us => us.subject_id === subject.id))
                          .map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={handleAddSubject}
                      disabled={!selectedSubject || isLoadingSubjects}
                      size="sm"
                    >
                      {isLoadingSubjects ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Display user subjects */}
                  <div className="flex flex-wrap gap-2">
                    {userSubjects.map((userSubject) => (
                      <Badge
                        key={userSubject.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {userSubject.subject?.name}
                        {currentRole === 'tutor' && userSubject.proficiency_level && (
                          <span className="text-xs">({userSubject.proficiency_level})</span>
                        )}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveSubject(userSubject.subject_id)}
                        />
                      </Badge>
                    ))}
                    {userSubjects.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {currentRole === 'tutor' 
                          ? 'No subjects added yet. Add subjects you can teach.'
                          : 'No subjects added yet. Add subjects you\'re interested in learning.'
                        }
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSaving}
              onClick={() => console.log('Save button clicked, form values:', form.getValues())}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSuccess={handleCoinPurchaseSuccess}
      />
    </div>)
}