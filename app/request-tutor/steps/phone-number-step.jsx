// components/steps/phone-number-step.tsx
import { useState, useEffect } from "react"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function PhoneNumberStep({ form }) {
  const [selectedCountry, setSelectedCountry] = useState('');

  // Get country code from form data to set as default
  const getCountryCode = (countryName) => {
    if (!countryName) return 'us'; // fallback to US if no country selected
    
    // Map common country names to their ISO codes (lowercase for react-phone-input-2)
    const countryMap = {
      'United States': 'us',
      'United Kingdom': 'gb',
      'Canada': 'ca',
      'Australia': 'au',
      'India': 'in',
      'Germany': 'de',
      'France': 'fr',
      'Japan': 'jp',
      'China': 'cn',
      'Brazil': 'br',
      'Mexico': 'mx',
      'Italy': 'it',
      'Spain': 'es',
      'Netherlands': 'nl',
      'Sweden': 'se',
      'Norway': 'no',
      'Denmark': 'dk',
      'Finland': 'fi',
      'Switzerland': 'ch',
      'Austria': 'at',
      'Belgium': 'be',
      'Poland': 'pl',
      'Russia': 'ru',
      'South Korea': 'kr',
      'Singapore': 'sg',
      'Malaysia': 'my',
      'Thailand': 'th',
      'Philippines': 'ph',
      'Indonesia': 'id',
      'Vietnam': 'vn',
      'South Africa': 'za',
      'Nigeria': 'ng',
      'Egypt': 'eg',
      'Israel': 'il',
      'United Arab Emirates': 'ae',
      'Saudi Arabia': 'sa',
      'Turkey': 'tr',
      'Greece': 'gr',
      'Portugal': 'pt',
      'Czech Republic': 'cz',
      'Hungary': 'hu',
      'Romania': 'ro',
      'Bulgaria': 'bg',
      'Croatia': 'hr',
      'Serbia': 'rs',
      'Ukraine': 'ua',
      'Belarus': 'by',
      'Lithuania': 'lt',
      'Latvia': 'lv',
      'Estonia': 'ee',
      'Slovakia': 'sk',
      'Slovenia': 'si',
      'Bosnia and Herzegovina': 'ba',
      'Montenegro': 'me',
      'North Macedonia': 'mk',
      'Albania': 'al',
      'Moldova': 'md',
      'Armenia': 'am',
      'Azerbaijan': 'az',
      'Georgia': 'ge',
      'Kazakhstan': 'kz',
      'Uzbekistan': 'uz',
      'Kyrgyzstan': 'kg',
      'Tajikistan': 'tj',
      'Turkmenistan': 'tm',
      'Afghanistan': 'af',
      'Pakistan': 'pk',
      'Bangladesh': 'bd',
      'Sri Lanka': 'lk',
      'Nepal': 'np',
      'Bhutan': 'bt',
      'Maldives': 'mv',
      'Myanmar': 'mm',
      'Cambodia': 'kh',
      'Laos': 'la',
      'Mongolia': 'mn',
      'North Korea': 'kp',
      'Taiwan': 'tw',
      'Hong Kong': 'hk',
      'Macau': 'mo',
      'New Zealand': 'nz',
      'Fiji': 'fj',
      'Papua New Guinea': 'pg',
    };
    
    return countryMap[countryName] || countryName.toLowerCase().substring(0, 2) || 'us';
  };

  // Initialize selected country based on form's country value
  useEffect(() => {
    const formCountry = form.getValues('country');
    console.log('Form country:', formCountry);
    if (formCountry) {
      const countryCode = getCountryCode(formCountry);
      setSelectedCountry(countryCode);
    }
  }, []);

  console.log('Phone number step form values:', form.getValues('phone_number'));

  const currentCountry = form.getValues('address.country');
  const defaultCountry = getCountryCode(currentCountry);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <PhoneInput
                {...field}
                value={form.getValues('phone_number')}
                country={selectedCountry || defaultCountry}
                enableSearch={true}
                disableSearchIcon={false}
                countryCodeEditable={false}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  fontSize: '16px',
                  paddingLeft: '50px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                }}
                containerStyle={{
                  maxWidth: '28rem',
                }}
                buttonStyle={{
                  border: '1px solid #d1d5db',
                  borderRight: 'none',
                  borderRadius: '6px 0 0 6px',
                }}
                dropdownStyle={{
                  textAlign: 'left',
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}