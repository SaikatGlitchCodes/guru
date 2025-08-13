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
        
        // Ensure formatted is a string, fallback to constructing it
        const formattedAddress = typeof props.formatted === 'string' 
          ? props.formatted 
          : `${props.housenumber || ''} ${props.street || ''} ${props.city || ''} ${props.state || ''} ${props.postcode || ''}`.trim()
        
        return {
          street: `${props.housenumber || ''} ${props.street || ''}`.trim(),
          city: props.city || props.town || props.village || '',
          state: props.state || props.region || '',
          zip: props.postcode || '',
          country: props.country || '',
          country_code: props.country_code || '',
          formatted: formattedAddress,
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
        return data.features.map(feature => {
          const props = feature.properties
          
          // Ensure formatted is a string, fallback to constructing it
          const formattedAddress = typeof props.formatted === 'string' 
            ? props.formatted 
            : `${props.housenumber || ''} ${props.street || ''} ${props.city || ''} ${props.state || ''} ${props.postcode || ''}`.trim()
          
          return {
            id: props.place_id,
            formatted: formattedAddress,
            street: `${props.housenumber || ''} ${props.street || ''}`.trim(),
            city: props.city || props.town || props.village || '',
            state: props.state || props.region || '',
            zip: props.postcode || '',
            country: props.country || '',
            country_code: props.country_code || '',
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0]
          }
        })
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
    // Ensure we have a proper string for the address
    const addressString = typeof selectedAddress.formatted === 'string' 
      ? selectedAddress.formatted 
      : `${selectedAddress.street || ''} ${selectedAddress.city || ''} ${selectedAddress.state || ''} ${selectedAddress.zip || ''}`.trim()
    
    // Set all address-related fields
    form.setValue('address', addressString)
    form.setValue('address_lat', selectedAddress.lat)
    form.setValue('address_lon', selectedAddress.lon)
    
    // Set individual address component fields
    form.setValue('street', selectedAddress.street || '')
    form.setValue('city', selectedAddress.city || '')
    form.setValue('state', selectedAddress.state || '')
    form.setValue('zip', selectedAddress.zip || '')
    form.setValue('country', selectedAddress.country || '')
    form.setValue('country_code', selectedAddress.country_code || '')

    setAddressSearchValue(addressString)
    setShowAddressSuggestions(false)
    setAddressSuggestions([])

    toast.success('Address selected successfully!')
  }, [form])

  const handleGetCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true)

    try {
      const coordinates = await getCurrentLocation()
      const addressInfo = await reverseGeocode(coordinates.latitude, coordinates.longitude)

      // Ensure we have a proper string for the address
      const addressString = typeof addressInfo.formatted === 'string' 
        ? addressInfo.formatted 
        : `${addressInfo.street || ''} ${addressInfo.city || ''} ${addressInfo.state || ''} ${addressInfo.zip || ''}`.trim()

      // Set all address-related fields
      form.setValue('address', addressString)
      form.setValue('address_lat', addressInfo.lat)
      form.setValue('address_lon', addressInfo.lon)
      
      // Set individual address component fields
      form.setValue('street', addressInfo.street || '')
      form.setValue('city', addressInfo.city || '')
      form.setValue('state', addressInfo.state || '')
      form.setValue('zip', addressInfo.zip || '')
      form.setValue('country', addressInfo.country || '')
      form.setValue('country_code', addressInfo.country_code || '')

      setAddressSearchValue(addressString)

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
    // Clear all address-related form values
    form.setValue('address', '')
    form.setValue('address_lat', '')
    form.setValue('address_lon', '')
    form.setValue('street', '')
    form.setValue('city', '')
    form.setValue('state', '')
    form.setValue('zip', '')
    form.setValue('country', '')
    form.setValue('country_code', '')
  }, [form])

  console.log("Address Search Value:", addressSearchValue)
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Information Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-medium">Address</h3>
            <p className="text-sm text-muted-foreground">Enter your address or use current location</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Locate className="h-4 w-4" />
            )}
            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Button>
        </div>

        {/* Single Address Input with Autocomplete */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Start typing your address..."
                    value={addressSearchValue || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      handleAddressSearchChange(e.target.value)
                    }}
                    onClick={() => setShowAddressSuggestions(true)}
                    className="pl-10 pr-10 w-full"
                    autoComplete="street-address"
                  />
                </FormControl>
                {(addressSearchValue || field.value) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearAddressSearch()
                    }}
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {/* Address Suggestions Dropdown - moved inside the relative container */}
                {showAddressSuggestions && (addressSearchValue || field.value)?.length >= 3 && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-50 border rounded-md shadow-lg bg-background max-h-60 overflow-hidden">
                    {isLoadingSuggestions ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Searching addresses...</span>
                      </div>
                    ) : addressSuggestions.length > 0 ? (
                      <div className="max-h-60 overflow-auto">
                        {addressSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-start p-3 cursor-pointer hover:bg-accent border-b last:border-b-0"
                            onClick={() => handleAddressSelect(suggestion)}
                          >
                            <MapPin className="mr-3 h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-medium text-sm leading-tight">{suggestion.formatted}</span>
                              {suggestion.city && suggestion.state && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  {suggestion.city}, {suggestion.state} {suggestion.zip}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No addresses found. Try a different search term.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Hidden coordinate fields */}
      <FormField
        control={form.control}
        name="address_lat"
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
        name="address_lon"
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