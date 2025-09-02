const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

export const getCurrentLocation = () => {
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
}

export const reverseGeocode = async (latitude, longitude) => {
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
                street: `${props.housenumber || ''} ${props.formatted || ''} ${props.street || ''}`.trim(),
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

export const searchAddresses = async (query) => {
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
                street: `${feature.properties.housenumber || ''} ${feature.properties.formatted} ${feature.properties.street || ''}`.trim(),
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

export const debouncedAddressSearch = (query) => {
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
}