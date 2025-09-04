"use client"

import { useState, useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { updateProfile } from "@/lib/supabaseAPI"
import { createProfileSchema, formData } from "@/components/profile/profileUtils"
import { getStepsForRole, getLayoutArrangement } from "./constants"
import ProfileFormNavigationButton from "./ProfileFormNavigation"
// Create dynamic schema based on role


export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { profile, loading, user } = useUser()
  const currentRole = profile?.role || 'student'
  const form = useForm({
    resolver: yupResolver(createProfileSchema(currentRole)),
    defaultValues: formData(profile, user),
    mode: "onChange",
  })

  // Auto-advance to next step if current step is already completed
  useEffect(() => {
    const steps = getStepsForRole(currentRole);
    
    // Check if we should auto-advance
    const checkAndAdvanceStep = () => {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const isStepComplete = step.fields.every(field => {
          const value = form.getValues(field);
          
          // Handle nested field errors (like address.street)
          const fieldParts = field.split('.');
          let hasError;
          
          if (fieldParts.length > 1) {
            hasError = form.formState.errors[fieldParts[0]]?.[fieldParts[1]];
          } else {
            hasError = form.formState.errors[field];
          }
          
          const hasValue = value && value !== '' && value !== 0;
          return hasValue && !hasError;
        });
        
        if (!isStepComplete) {
          setCurrentStep(i);
          return;
        }
      }
      // If all steps are complete, go to last step
      setCurrentStep(steps.length - 1);
    };

    if (profile && user) {
      // Small delay to ensure form is properly initialized
      setTimeout(checkAndAdvanceStep, 100);
    }
  }, [profile, user, currentRole, form.formState.errors])
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access your profile.</p>
        </div>
      </div>
    )
  }

  const steps = getStepsForRole(currentRole)
  const layoutSteps = getLayoutArrangement(steps, currentStep)

  async function onSubmit(data) {
    console.log('Form submission started with data:', data)
    setIsSaving(true)

    try {
      // Validate the entire form
      const isValid = await form.trigger();
      console.log('Form validation result:', isValid)

      if (!isValid) {
        const errors = form.formState.errors;
        console.log('Form validation errors:', errors)

        // Display a more user-friendly error summary
        if (Object.keys(errors).length > 0) {
          // Get the first error message to show in the toast
          const firstErrorField = Object.keys(errors)[0];
          const firstError = errors[firstErrorField];
          const errorMessage = firstError?.message || 'Form validation failed';

          toast.error(`Please fix the form errors: ${errorMessage}`);
        }

        setIsSaving(false);
        return;
      }

      console.log('Calling updateProfile with:', data, profile.email)
      const result = await updateProfile(data, profile.email);
      console.log('Update result:', result)

      if (result.error) {
        throw new Error(result.error.message || result.error);
      }

      // Reset form dirty state after successful save
      form.reset(data, { keepValues: true });

      toast.success("Your profile has been updated successfully!")

    } catch (error) {
      console.error("Error saving profile:", error);

      // More descriptive error messages
      if (error.message.includes("network")) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else if (error.message.includes("permission")) {
        toast.error("You don't have permission to update this profile.");
      } else {
        toast.error(`Failed to update your profile: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Form Section - 2 Column Grid Layout */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
              {layoutSteps.map((step, index) => {
                const { Component, layout, title } = step;
                return (
                  <div 
                    key={`${title}-${index}`}
                    className="profile-step-container"
                  >
                    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <Component form={form} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Navigation Section - Full Width */}
            <div className="w-full">
              <ProfileFormNavigationButton
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                form={form}
                isSaving={isSaving}
                onSubmit={onSubmit}
                role={currentRole}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}