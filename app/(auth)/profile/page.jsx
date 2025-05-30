"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, Loader2, Star, MapPin, Locate, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const profileFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.enum(["student", "tutor", "admin", "user"], {
    required_error: "Please select a role.",
  }),
  phone: z.string().optional(),
  gender: z.string(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    formatted: z.string().optional(),
  }),
  bio: z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  hobbies: z.string().optional(),
  status: z.enum(["active", "inactive", "ban"]),
})

export default function ProfilePage() {
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  
  // Address autocomplete states
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [addressSearchValue, setAddressSearchValue] = useState("")
  
  const { profile, loading } = useUser()
  const debounceRef = useRef(null)

  // Geoapify API key - add this to your .env.local file
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profile,
      address: {
        ...profile?.address,
        formatted: profile?.address?.formatted || ""
      }
    },
    mode: "onChange",
  })

  // Initialize address search value from form
  useEffect(() => {
    const formattedAddress = form.getValues('address.formatted')
    if (formattedAddress && !addressSearchValue) {
      setAddressSearchValue(formattedAddress)
    }
  }, [form, addressSearchValue])

  // Function to get current location
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

  // Function to reverse geocode coordinates using Geoapify
  const reverseGeocode = useCallback(async (latitude, longitude) => {
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
          formatted: props.formatted || '',
          latitude,
          longitude
        }
      } else {
        throw new Error('No address found for the given coordinates')
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      throw error
    }
  }, [GEOAPIFY_API_KEY])

  // Function to search addresses using Geoapify Autocomplete
  const searchAddresses = useCallback(async (query) => {
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
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        }))
      }
      
      return []
    } catch (error) {
      console.error('Address search error:', error)
      return []
    }
  }, [GEOAPIFY_API_KEY])

  // Debounced address search
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
  }, [searchAddresses])

  // Handle address search input change
  const handleAddressSearchChange = useCallback((value) => {
    setAddressSearchValue(value)
    setShowAddressSuggestions(true)
    debouncedAddressSearch(value)
  }, [debouncedAddressSearch])

  // Handle address selection
  const handleAddressSelect = useCallback((selectedAddress) => {
    // Update form fields
    form.setValue('address.formatted', selectedAddress.formatted)
    form.setValue('address.street', selectedAddress.street)
    form.setValue('address.city', selectedAddress.city)
    form.setValue('address.state', selectedAddress.state)
    form.setValue('address.zip', selectedAddress.zip)
    form.setValue('address.latitude', selectedAddress.latitude)
    form.setValue('address.longitude', selectedAddress.longitude)
    
    // Update search value and hide suggestions
    setAddressSearchValue(selectedAddress.formatted)
    setShowAddressSuggestions(false)
    setAddressSuggestions([])
    
    toast.success('Address selected successfully!')
  }, [form])

  // Function to handle getting current location and updating address
  const handleGetCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true)
    
    try {
      // Get current coordinates
      const coordinates = await getCurrentLocation()
      
      // Reverse geocode to get address
      const addressInfo = await reverseGeocode(coordinates.latitude, coordinates.longitude)
      
      // Update form fields
      form.setValue('address.formatted', addressInfo.formatted)
      form.setValue('address.street', addressInfo.street)
      form.setValue('address.city', addressInfo.city)
      form.setValue('address.state', addressInfo.state)
      form.setValue('address.zip', addressInfo.zip)
      form.setValue('address.latitude', addressInfo.latitude)
      form.setValue('address.longitude', addressInfo.longitude)
      
      // Update search value
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

  // Clear address search
  const clearAddressSearch = useCallback(() => {
    setAddressSearchValue("")
    setAddressSuggestions([])
    setShowAddressSuggestions(false)
    
    // Clear form fields
    form.setValue('address.formatted', '')
    form.setValue('address.street', '')
    form.setValue('address.city', '')
    form.setValue('address.state', '')
    form.setValue('address.zip', '')
    form.setValue('address.latitude', undefined)
    form.setValue('address.longitude', undefined)
  }, [form])

  function onSubmit(data) {
    setIsSaving(true)

    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      toast("Profile has been saved successfully")
    }, 1000)
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }, 1000)
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <AvatarFallback>JS</AvatarFallback>
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
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-muted text-muted" />
                      <span className="ml-1 text-sm font-medium">4.0</span>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    name="phone"
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
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View your account status and balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">{}</p>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-900">$</span>
                  </div>
                  <p name="coin_balance" className="text-2xl font-bold">{form.getValues().coin_balance}</p>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: May 28, 2025</p>
              </div>

              <Separator />

              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <Select defaultValue={field.value} disabled>
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
                </form>
              </Form>
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
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
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
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
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
                </form>
              </Form>
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
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  {/* Address Search with Autocomplete */}
                  <div className="space-y-2">
                    <FormLabel>Search Address</FormLabel>
                    <Popover open={showAddressSuggestions} onOpenChange={setShowAddressSuggestions}>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Start typing an address..."
                            value={addressSearchValue}
                            onChange={(e) => handleAddressSearchChange(e.target.value)}
                            onFocus={() => setShowAddressSuggestions(true)}
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
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandList>
                            {isLoadingSuggestions ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Searching addresses...</span>
                              </div>
                            ) : addressSuggestions.length > 0 ? (
                              <CommandGroup>
                                {addressSuggestions.map((suggestion) => (
                                  <CommandItem
                                    key={suggestion.id}
                                    value={suggestion.formatted}
                                    onSelect={() => handleAddressSelect(suggestion)}
                                    className="cursor-pointer"
                                  >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                      <span className="font-medium">{suggestion.formatted}</span>
                                      {suggestion.city && suggestion.state && (
                                        <span className="text-xs text-muted-foreground">
                                          {suggestion.city}, {suggestion.state}
                                        </span>
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ) : addressSearchValue.length >= 3 ? (
                              <CommandEmpty>No addresses found.</CommandEmpty>
                            ) : (
                              <div className="p-4 text-sm text-muted-foreground text-center">
                                Type at least 3 characters to search
                              </div>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

                  {/* Hidden fields for coordinates and formatted address */}
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
                    name="address.latitude"
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
                    name="address.longitude"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  )
}