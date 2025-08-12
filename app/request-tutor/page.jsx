"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { EmailVerificationStep } from "@/app/request-tutor/steps/email-verification-step"
import { NameAddressStep } from "@/app/request-tutor/steps/name-address-step"
import { PhoneNumberStep } from "@/app/request-tutor/steps/phone-number-step"
import { RequirementDescriptionStep } from "@/app/request-tutor/steps/requirement-description-step"
import { SubjectMeetingStep } from "@/app/request-tutor/steps/subject-meeting-step"
import { BudgetPreferencesStep } from "@/app/request-tutor/steps/budget-preferences-step"
import { formSchema } from "./util/request-schema"
import { useUser } from "@/contexts/UserContext"
import FormNavigationButton from "./submitForm"
import { FormPersistence } from "@/lib/formPersistence"
import { REQUEST_STEPS } from "./constants"

const requestTypes = ["Tutoring", "Job Support", "Assignment"]
const levels = [
  "Beginner", "Intermediate", "Advanced",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11",
]
const priceOptions = ["fixed/flat", "per hour", "per day", "per month", "per year"]
const genderPreferences = ["None", "Prefer Male", "Prefer Female", "Only Male"]
const tutorsWant = ["Only one", "More than one", "As many as Possible"]
const iNeedSomeone = ["full time", "part time", "volunteer", "student"]

function RequestTutorContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const searchParams = useSearchParams()
  const { user, profile, signInWithMagicLink } = useUser()
  const [resendTimer, setResendTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [formPersistence] = useState(() => new FormPersistence('tutorRequestForm'))
  const [hasSavedData, setHasSavedData] = useState(false)

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setResendTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: searchParams.get('type') === 'job-support' ? 'Job Support' : requestTypes[0],
      user_email: user?.email || "",
      name: profile?.name || "",
      address: {
        addressline_1: "",
        addressline_2: "",
        country: "",
        country_code: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        abbreviation_STD: "",
        offset_STD: "",
        lat: 0,
        lon: 0,
      },
      phone_number: "",
      description: "",
      subject: [],
      level: levels[0],
      meeting_options: {
        Online: { state: false },
        Offline: { state: false },
        Travel: { state: false },
      },
      price_amount: 0,
      price_option: priceOptions[0],
      price_currency: "USD",
      price_currency_symbol: "$",
      gender_preference: genderPreferences[0],
      tutors_want: tutorsWant[0],
      i_need_someone: iNeedSomeone[0],
      language: [],
      get_tutors_from: "",
      upload_file: undefined,
    },
  })

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = formPersistence.loadFormData()
    if (savedData) {
      setHasSavedData(true)
      
      // Merge saved data with current form values
      Object.keys(savedData).forEach(key => {
        if (savedData[key] !== undefined && savedData[key] !== null) {
          form.setValue(key, savedData[key])
        }
      })
    }
  }, [form, formPersistence])

  // Save form data whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Only save if we have meaningful data (not just default values)
      const hasData = value.description || 
                     value.subject?.length > 0 || 
                     value.price_amount > 0 ||
                     value.language?.length > 0
      
      if (hasData) {
        formPersistence.saveFormData(value)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form, formPersistence])

  // Clear saved data when form is successfully submitted
  const clearSavedData = () => {
    formPersistence.clearFormData()
    setHasSavedData(false)
  }

  // Update form values when user/profile data loads
  useEffect(() => {
    if (user) {
      form.setValue('user_email', user.email || "")
    }
    
    if (profile) {
      form.setValue('name', profile.name || "")
      form.setValue('phone_number', profile.phone_number || "")
      
      if (profile.address) {
        // Map database field names to form field names
        form.setValue('address.addressline_1', profile.address.address_line_1 || "")
        form.setValue('address.addressline_2', profile.address.address_line_2 || "")
        form.setValue('address.country', profile.address.country || "")
        form.setValue('address.country_code', profile.address.country_code || "")
        form.setValue('address.street', profile.address.street || "")
        form.setValue('address.city', profile.address.city || "")
        form.setValue('address.state', profile.address.state || "")
        form.setValue('address.zip', profile.address.zip || "")
        form.setValue('address.abbreviation_STD', profile.address.abbreviation_STD || "")
        form.setValue('address.offset_STD', profile.address.offset_STD || "")
        form.setValue('address.lat', profile.address.lat || 0)
        form.setValue('address.lon', profile.address.lon || 0)
      }
    }
  }, [user, profile, form])

  useEffect(() => {
    if (user && currentStep === 0) {
      setCurrentStep(1)
    } 
    if (user && profile && currentStep === 1 && profile.address) {
      setCurrentStep(2)
    }
    if (user && profile && currentStep === 2 && profile.phone_number) {
      setCurrentStep(3)
    }
    setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 50);
  }, [user, profile, currentStep])

  const handleResendEmail = async () => {
    console.log("Resending magic link to:", form.getValues("email"))
    signInWithMagicLink(form.getValues("email"))
    setResendDisabled(true);
  }

  const renderSuccessScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Request Submitted Successfully!</h2>
        <p className="mb-6 text-muted-foreground">
          Thank you for submitting your tutor request. We'll match you with the perfect tutor soon.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">A confirmation has been sent to your email address.</p>
        <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
      </div>
    )
  }

  const renderSuccessScreenForUnauthenticated = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">We've sent a magic link to your email address. </h2>
        <p className="mb-6 text-muted-foreground">
          Please click on the link to complete your request. It expires in 5 minutes.
        </p>
        <Button onClick={handleResendEmail} disabled={resendDisabled}>{resendDisabled ? `Resend Email (${resendTimer}s)` : 'Re-Send Email'} </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Request a Tutor!</h1>
        <p className="text-muted-foreground mt-2">Fill out the form below to get matched with the perfect tutor</p>
      </div>

      {hasSavedData && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            We've restored your previously saved form data. You can continue from where you left off.
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2 text-blue-600 underline"
              onClick={() => {
                formPersistence.clearFormData()
                setHasSavedData(false)
                window.location.reload()
              }}
            >
              Start fresh instead
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isSubmitting ? (
        <Card className="shadow-none border-0">
          <CardContent className="md:pt-6">
            <Form {...form}>
              <form>
                <div className="space-y-6">
                  <div className="pb-8 border-b border-gray-900/10">
                    {REQUEST_STEPS.slice(0, currentStep + 1).map(({ title, Component }, index) => (
                      <div className="mb-5" key={title}><Component form={form} /></div>
                    ))}
                  </div>
                </div>
                <FormNavigationButton
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  form={form}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  clearSavedData={clearSavedData}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">{!user ? renderSuccessScreenForUnauthenticated() : renderSuccessScreen()}</CardContent>
        </Card>
      )}
    </div>
  )
}

// Loading component for suspense fallback
function RequestTutorLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="text-gray-500">Loading request form...</div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main export with Suspense boundary
export default function RequestTutorPage() {
  return (
    <Suspense fallback={<RequestTutorLoading />}>
      <RequestTutorContent />
    </Suspense>
  )
}