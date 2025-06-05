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

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
  { value: "ru", label: "Russian" },
  { value: "pt", label: "Portuguese" },
  { value: "hi", label: "Hindi" },
]

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
]

const priceOptions = ["fixed/flat", "per hour", "per day", "per month", "per year"]
const genderPreferences = ["None", "Prefer Male", "Prefer Female", "Only Male"]
const tutorsWant = ["Only one", "More than one", "As many as Possible"]
const iNeedSomeone = ["full time", "part time", "volunteer", "student"]

export function BudgetPreferencesStep({ form }) {
  const [open, setOpen] = useState(false)
  const [fileNames, setFileNames] = useState([])
  
  const selectedCurrency = form.watch("price_currency") || "USD"
  const currencySymbol = currencies.find(c => c.code === selectedCurrency)?.symbol || "$"

  const handleCurrencyChange = (code) => {
    const currency = currencies.find(c => c.code === code);
    form.setValue("price_currency", code);
    form.setValue("price_currency_symbol", currency?.symbol || "$");
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFileNames = Array.from(files).map((file) => file.name)
      setFileNames((prev) => [...prev, ...newFileNames])
      
      const fileMetadata = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      
      form.setValue("upload_file", fileMetadata);
    }
  }

  return (
    <div className="space-y-6">
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
                    {currencySymbol}
                  </span>
                  <Input
                    {...field}
                    type="number"
                    min="0"
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
              <Select onValueChange={handleCurrencyChange} value={field.value || "USD"}>
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

      {/* File Upload */}
      <FormField
        control={form.control}
        name="upload_file"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Documents (Optional)</FormLabel>
            <FormControl>
              <div className="rounded-md border border-dashed p-6 text-center max-w-lg">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Select Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </FormControl>
            {fileNames.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                <ul className="space-y-1">
                  {fileNames.map((name, index) => (
                    <li key={index} className="text-sm">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}