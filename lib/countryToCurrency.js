// Country to currency mapping
export const countryToCurrencyMap = {
  // North America
  "United States": "USD",
  "USA": "USD",
  "US": "USD",
  "Canada": "CAD",
  "Mexico": "USD", // Many prefer USD in Mexico
  
  // Europe
  "Germany": "EUR",
  "France": "EUR",
  "Italy": "EUR",
  "Spain": "EUR",
  "Netherlands": "EUR",
  "Belgium": "EUR",
  "Austria": "EUR",
  "Portugal": "EUR",
  "Ireland": "EUR",
  "Greece": "EUR",
  "Finland": "EUR",
  "Luxembourg": "EUR",
  "Slovenia": "EUR",
  "Slovakia": "EUR",
  "Estonia": "EUR",
  "Latvia": "EUR",
  "Lithuania": "EUR",
  "Malta": "EUR",
  "Cyprus": "EUR",
  "United Kingdom": "GBP",
  "UK": "GBP",
  "Britain": "GBP",
  "England": "GBP",
  "Scotland": "GBP",
  "Wales": "GBP",
  "Northern Ireland": "GBP",
  
  // Asia Pacific
  "Japan": "JPY",
  "Australia": "AUD",
  "New Zealand": "USD", // Many prefer USD for international services
  "Singapore": "SGD",
  "Hong Kong": "HKD",
  "South Korea": "USD",
  "India": "INR",
  "China": "CNY",
  "Thailand": "USD",
  "Vietnam": "USD",
  "Philippines": "USD",
  "Malaysia": "USD",
  "Indonesia": "USD",
  "Taiwan": "USD",
  
  // Middle East & Africa
  "United Arab Emirates": "USD",
  "UAE": "USD",
  "Saudi Arabia": "USD",
  "Qatar": "USD",
  "Kuwait": "USD",
  "Israel": "USD",
  "Turkey": "USD",
  "South Africa": "USD",
  "Egypt": "USD",
  "Nigeria": "USD",
  "Kenya": "USD",
  
  // South America
  "Brazil": "USD",
  "Argentina": "USD",
  "Chile": "USD",
  "Colombia": "USD",
  "Peru": "USD",
  "Venezuela": "USD",
  "Uruguay": "USD",
  "Ecuador": "USD",
  
  // Others
  "Switzerland": "CHF",
  "Norway": "NOK",
  "Sweden": "SEK",
  "Denmark": "DKK",
  "Poland": "PLN",
  "Czech Republic": "CZK",
  "Hungary": "EUR",
  "Romania": "EUR",
  "Bulgaria": "EUR",
  "Croatia": "EUR",
  "Russia": "USD",
  "Ukraine": "USD",
  "Belarus": "USD",
}

export function getCurrencyByCountry(country) {
  if (!country) return "USD" // Default fallback
  
  // Normalize the country name for lookup
  const normalizedCountry = country.trim()
  
  // Direct lookup
  if (countryToCurrencyMap[normalizedCountry]) {
    return countryToCurrencyMap[normalizedCountry]
  }
  
  // Fuzzy matching for partial matches
  const countryLower = normalizedCountry.toLowerCase()
  for (const [key, currency] of Object.entries(countryToCurrencyMap)) {
    if (key.toLowerCase().includes(countryLower) || countryLower.includes(key.toLowerCase())) {
      return currency
    }
  }
  
  // Default to USD if no match found
  return "USD"
}
