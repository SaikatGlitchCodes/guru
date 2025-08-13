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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                autoComplete="email"
                className="max-w-md"
                readOnly={!!user?.email}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground">
              Use a permanent(gmail) address where you can receive mail.
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}