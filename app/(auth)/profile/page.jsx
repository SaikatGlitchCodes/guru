"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Camera, Loader2, Star, MapPin, Locate, Search, X, Plus, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { updateProfile, createProfile, getAllSubjects, getUserSubjects, addUserSubject, removeUserSubject } from "@/lib/supabaseAPI"
import { WalletModal } from "@/components/WalletModal"

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

const profileFormSchema = yup.object({
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
    .oneOf(["student", "tutor", "admin", "user"], "Please select a valid role")
    .required("Please select your role"),
  phone_number: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  gender: yup
    .string()
    .optional(),
  address: yup.object({
    id: yup.string().optional(),
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
}).required("Please complete the form");

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
  
  const { profile, loading, uploadAvatarToSupabase, user, refreshUserData } = useUser()
  const debounceRef = useRef(null)

  const form = useForm({
    resolver: yupResolver(profileFormSchema),
    defaultValues: profile,
    mode: "onChange",
  })

  useEffect(() => {
    if (profile) {
      console.log('Profile data received:', profile)
      const formattedAddress = profile.address
        ? `${addressSearchValue || profile.address.street || ""} ${profile.address.city || ""} ${profile.address.state || ""} ${profile.address.zip || ""}`.trim()
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
  }, [profile, form])

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
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-4 rounded text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Profile loaded: {!!profile ? 'Yes' : 'No'}</p>
              <p>Form is valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
              <p>Is saving: {isSaving ? 'Yes' : 'No'}</p>
              <p>Form dirty: {form.formState.isDirty ? 'Yes' : 'No'}</p>
              {Object.keys(form.formState.errors).length > 0 && (
                <p style={{color: 'red'}}>Errors: {JSON.stringify(form.formState.errors)}</p>
              )}
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Information Column */}
            <div className="space-y-6">
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
                          className={`h-4 w-4 ${star <= Math.floor(form.getValues().rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted'
                            }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium">{Number(form.watch('rating'))?.toFixed(1) || '0.0'}</span>
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
                        <FormDescription>Your email address is read-only.</FormDescription>
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="tutor">Tutor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your gender" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View your account status and balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                          <span className="text-xs font-bold text-yellow-900">$</span>
                        </div>
                        <p className="text-2xl font-bold">{form.watch('coin_balance')}</p>
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
                    <p className="text-xs text-muted-foreground">Last updated: May 30, 2025</p>
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
                </CardContent>
              </Card>
            </div>

            {/* Profile Details Column */}
            <div className="space-y-6">
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
                          <Textarea placeholder="Tell us about yourself..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormDescription>Write a short bio to introduce yourself to others.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="years_of_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
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

              <Card>
                <CardHeader>
                  <CardTitle>Your Subjects</CardTitle>
                  <CardDescription>Manage subjects you're interested in or can teach</CardDescription>
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
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveSubject(userSubject.subject_id)}
                        />
                      </Badge>
                    ))}
                    {userSubjects.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No subjects added yet. Add subjects you're interested in or can teach.
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