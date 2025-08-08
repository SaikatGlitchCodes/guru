// components/steps/name-address-step.tsx
import { useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Loader2, Locate, Search, MapPin, X } from "lucide-react"
import { toast } from "sonner"

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

export function NameAddressStep({ form }) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false)
  const [addressSearchValue, setAddressSearchValue] = useState("")
  const debounceRef = useRef(null)

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
  }, [])
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="John Doe"
                autoComplete="name"
                className="max-w-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Information Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Address Information</h3>
            <p className="text-sm text-muted-foreground">Enter your address details</p>
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

          <FormDescription>
            Search and select your address from suggestions, or fill in manually below.
          </FormDescription>
        </div>

        <Separator />
      </div>

      <FormField
        control={form.control}
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="123 Main St"
                autoComplete="street-address"
                className="max-w-md"
              />
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
    </div>
  )
}