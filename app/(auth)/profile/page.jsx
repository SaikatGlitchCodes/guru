"use client"

import { useState, useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { updateProfile } from "@/lib/supabaseAPI"
import CommonProfileComponents from "@/components/profile/CommonProfileComponents"
import Subject from "@/components/profile/TutorComponents/Subject"
import RequestMatching from "@/components/profile/TutorComponents/RequestMatching"
import { createProfileSchema, formData } from "@/components/profile/profileUtils"
// Create dynamic schema based on role


export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const { profile, loading, user } = useUser()
  const currentRole = profile?.role || 'student'

  const form = useForm({
    resolver: yupResolver(createProfileSchema(currentRole)),
    defaultValues: formData(profile, user),
    mode: "onChange",
  })
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

  async function onSubmit(data) {
    console.log('Form submission started with data:', data)
    setIsSaving(true)

    try {
      // Validate the form first
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
    <div className="container py-10 mx-auto px-3 lg:px-0">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {currentRole === 'tutor' ? 'Tutor Profile' : 'Student Profile'}
            </h1>
            <p className="text-muted-foreground">
              {currentRole === 'tutor'
                ? 'Manage your teaching profile and professional information'
                : 'Manage your learning profile and account information'
              }
            </p>
          </div>
          <Badge variant={currentRole === 'tutor' ? 'default' : 'secondary'} className="text-sm">
            {currentRole === 'tutor' ? 'Tutor' : 'Student'}
          </Badge>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CommonProfileComponents form={form} />
          {form.watch('role') === 'tutor' && (
            <>
              <Subject form={form} />
              <RequestMatching form={form} />
            </>
          )}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              onClick={() => console.log('Save button clicked, form values:', form.getValues())}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>

    </div>)
}