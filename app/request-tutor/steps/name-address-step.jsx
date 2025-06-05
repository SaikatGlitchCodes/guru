// components/steps/name-address-step.tsx
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function NameAddressStep({ form }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="John Doe"
                autoComplete="name"
                className="max-w-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="123 Main St"
                autoComplete="street-address"
                className="max-w-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="New York"
                  autoComplete="address-level2"
                />
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
              <FormLabel>State / Province</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="NY"
                  autoComplete="address-level1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="United States"
                  autoComplete="country-name"
                />
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
              <FormLabel>ZIP / Postal Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="10001"
                  autoComplete="postal-code"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}
    </div>
  )
}