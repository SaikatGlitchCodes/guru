// components/steps/budget-preferences-step.tsx
"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"
import { getCurrencyByCountry } from "@/lib/countryToCurrency"

const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "arabic", label: "Arabic" },
  { value: "russian", label: "Russian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "hindi", label: "Hindi" },
  { value: "bengali", label: "Bengali" },
  { value: "urdu", label: "Urdu" },
  { value: "turkish", label: "Turkish" },
  { value: "korean", label: "Korean" },
  { value: "italian", label: "Italian" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "marathi", label: "Marathi" },
  { value: "gujarati", label: "Gujarati" },
  { value: "malayalam", label: "Malayalam" },
  { value: "punjabi", label: "Punjabi" },
  { value: "bhojpuri", label: "Bhojpuri" },
  { value: "swahili", label: "Swahili" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "thai", label: "Thai" },
]

const currencies = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Złoty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
]

const priceOptions = ["per hour", "fixed/flat", "per day", "per month", "per year"]
const genderPreferences = ["None", "Prefer Male", "Prefer Female", "Only Male", "Only Female"]
const tutorsWant = ["Only one", "More than one", "As many as Possible"]
const iNeedSomeone = ["freelance", "full time", "part time", "volunteer", "student"]

export function BudgetPreferencesStep({ form }) {
  const [open, setOpen] = useState(false)
  const { profile } = useUser()

  console.log('User Profile:', form.getValues())
  const suggestedCurrency = getCurrencyByCountry(form.getValues('country') || profile?.address?.country);
  const suggestedSymbol = currencies.find(c => c.code === suggestedCurrency)?.symbol || "$";


  console.log('Suggested currency:', suggestedCurrency, 'currencySymbol:', suggestedSymbol)


  // Restore currency from localStorage if form gets reset
  useEffect(() => {
    form.setValue("price_currency", suggestedCurrency || "USD")
    form.setValue("price_currency_symbol", suggestedSymbol || "$")

  }, [])

  const handleCurrencyChange = (code) => {
    const currency = currencies.find(c => c.code === code);
    form.setValue("price_currency", code);
    form.setValue("price_currency_symbol", currency?.symbol || "$");
  }

  return (
    <div className="space-y-6 border-t-2 pt-12">
      {/* Budget, Price Unit and Currency */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          control={form.control}
          name="price_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {suggestedSymbol}
                  </span>
                  <Input
                    {...field}
                    type="number"
                    placeholder="50"
                    className="pl-8"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_option"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Unit</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priceOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={handleCurrencyChange} value={field.value || suggestedCurrency || "USD"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Gender Preference and Tutors Want */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="gender_preference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender Preference</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genderPreferences.map((preference) => (
                    <SelectItem key={preference} value={preference}>
                      {preference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tutors_want"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many tutors do you want?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tutorsWant.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* I Need Someone */}
      <FormField
        control={form.control}
        name="i_need_someone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>I need someone who is available</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {iNeedSomeone.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Languages Multi-select */}
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language I prefer</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {field.value && field.value.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {field.value.map((lang) => (
                          <Badge key={lang.value} variant="secondary">
                            {lang.label}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span>Select languages...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search languages..." />
                  <CommandList>
                    <CommandEmpty>No languages found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          key={language.value}
                          value={language.value}
                          onSelect={() => {
                            const currentValue = field.value || [];
                            const isSelected = currentValue.some(lang => lang.value === language.value);
                            let newLanguages;

                            if (isSelected) {
                              newLanguages = currentValue.filter(lang => lang.value !== language.value);
                            } else {
                              newLanguages = [...currentValue, language];
                            }

                            field.onChange(newLanguages);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.some(lang => lang.value === language.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Get Tutors From */}
      <FormField
        control={form.control}
        name="get_tutors_from"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Get tutors from (Optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="University of California, etc."
              />
            </FormControl>
            <div className="text-xs text-muted-foreground">
              Optionally specify a school or institution you'd like your tutors to be from.
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}