// components/steps/requirement-description-step.tsx
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RequirementDescriptionStep({ form }) {
  return (
    <div className="space-y-4 border-t-2 pt-6">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Describe Your Learning Needs</FormLabel>
            <div className="rounded-md bg-red-50 px-4 py-2 dark:bg-red-950">
              <p className="text-sm text-red-800 dark:text-red-300">
                <strong>Important:</strong> Please don't share any contact/personal important details (phone, email, card,
                website etc) here.
              </p>
            </div>
            <FormControl>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Textarea
                      placeholder="Example: I am looking for someone with experience in teaching IGCSE Maths online to young kids. My daughter is available from 4.30 pm EST to 8.30 pm EST on weekdays and flexible on Weekends. You should have a digital pen and good internet connection. My budget is a maximum of ₹35 per hour."
                      className="min-h-[200px] text-sm"
                      {...field}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm font-medium">Things you may write:</p>
                    <ul className="mt-1 text-xs space-y-1">
                      <li>• Required experience</li>
                      <li>• Expectations</li>
                      <li>• Budget</li>
                      <li>• Time</li>
                      <li>• Task details</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />



    </div>
  )
}