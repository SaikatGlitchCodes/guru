import React, { useCallback, useRef, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Loader2, Locate, MapPin, Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { getCurrentLocation, reverseGeocode, searchAddresses } from '@/lib/location/fetchLocation';
import { toast } from 'sonner';

export default function AddressInfo({ form }) {
    React.useEffect(() => {
        const existingAddress = form.getValues('address.formatted');
        if (existingAddress && !addressSearchValue) {
            setAddressSearchValue(existingAddress);
        }
    }, [form.watch('address.formatted')]);

    const debounceRef = useRef(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [addressSearchValue, setAddressSearchValue] = useState("");

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
        form.setValue('address', selectedAddress)

        setAddressSearchValue(selectedAddress.formatted)
        setShowAddressSuggestions(false)
        setAddressSuggestions([])
    }, [form])

    const handleGetCurrentLocation = useCallback(async () => {
        setIsGettingLocation(true);
        try {
            const coordinates = await getCurrentLocation();
            const addressInfo = await reverseGeocode(coordinates.latitude, coordinates.longitude);

            // Update form with the fetched address
            form.setValue('address', addressInfo);
            setAddressSearchValue(addressInfo.formatted);

            toast.success('Location detected successfully!');
        } catch (error) {
            console.error('Location error:', error);

            let errorMessage = 'Failed to get your location. ';

            if (error.code === 1) {
                errorMessage += 'Please allow location access and try again.';
            } else if (error.code === 2) {
                errorMessage += 'Location information is unavailable.';
            } else if (error.code === 3) {
                errorMessage += 'Location request timed out.';
            } else {
                errorMessage += error.message || 'Please try again.';
            }
            toast.error(errorMessage);
        } finally {
            setIsGettingLocation(false);
        }
    }, [form]);

    const clearAddressSearch = useCallback(() => {
        setAddressSearchValue("");
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
        // Clear the form address fields
        form.setValue('address', {});
    }, [form]);
    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Address Information</CardTitle>
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
            <CardContent className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City *</FormLabel>
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

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                </div>

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
    )
}
