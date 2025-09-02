// components/steps/budget-preferences-step.tsx
"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, languages } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"
import { getCurrencyByCountry } from "@/lib/countryToCurrency"

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
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

  const suggestedCurrency = getCurrencyByCountry(form.watch('country') || profile?.address?.country);
  const suggestedSymbol = currencies.find(c => c.code === suggestedCurrency)?.symbol || "₹";


  console.log('Suggested currency:', suggestedCurrency, 'currencySymbol:', suggestedSymbol)


  // Restore currency from localStorage if form gets reset
  useEffect(() => {
    form.setValue("price_currency", suggestedCurrency || "INR")
    form.setValue("price_currency_symbol", suggestedSymbol || "₹")

  }, [])

  return (
    <div className="space-y-6 md:border-t-2 md:pt-12 pt-5">
      {/* Budget, Price Unit and Currency */}
      <div>
        <p className="text-sm font-semibold mb-1">Budget, Price Unit</p>
        <div className="flex items-center">
          <FormField
            control={form.control}
            name="price_amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {suggestedSymbol}
                    </span>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || ""}
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-40">
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
        </div>
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
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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