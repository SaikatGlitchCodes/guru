// components/steps/phone-number-step.tsx
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function PhoneNumberStep({ form }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                placeholder="(123) 456-7890"
                autoComplete="tel"
                className="max-w-md"
              />
            </FormControl>
            <div className="text-xs text-muted-foreground">
              Your phone number will be used for communication about your tutor request.
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}