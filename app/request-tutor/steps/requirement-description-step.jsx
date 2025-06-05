// components/steps/requirement-description-step.tsx
import { UseFormReturn } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function RequirementDescriptionStep({ form }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> The more details you provide, the better we can match you with the right tutor. Include
          your current level, specific topics, goals, and any challenges you're facing.
        </p>
      </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Describe Your Learning Needs</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Example: I am looking for someone with experience in teaching IGCSE Maths online to young kids. My daughter is available from 4.30 pm EST to 8.30 pm EST on weekdays and flexible on Weekends. You should have a digital pen and good internet connection. My budget is a maximum of $35 per hour."
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-950">
        <p className="text-sm text-red-800 dark:text-red-300">
          <strong>Important:</strong> Please don't share any contact/personal important details (phone, email, card,
          website etc) here.
        </p>
      </div>

      
    </div>
  )
}