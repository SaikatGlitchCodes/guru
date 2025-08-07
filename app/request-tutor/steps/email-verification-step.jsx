"use client"

import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUser } from "@/contexts/UserContext"

export function EmailVerificationStep({ form }) {
  const { user } = useUser()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="user_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="your.email@example.com"
                autoComplete="email"
                className="max-w-md"
                readOnly={!!user?.email}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground">
              Use a permanent address where you can receive mail.
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-md bg-muted p-4">
        <p className="text-sm">
          <strong>Note:</strong> Your email will only be used to communicate about your tutor request and will not be
          shared publicly.
        </p>
      </div>
    </div>
  )
}