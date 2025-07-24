"use client"

"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { EmailVerificationStep } from "@/app/request-tutor/steps/email-verification-step"
import { NameAddressStep } from "@/app/request-tutor/steps/name-address-step"
import { PhoneNumberStep } from "@/app/request-tutor/steps/phone-number-step"
import { RequirementDescriptionStep } from "@/app/request-tutor/steps/requirement-description-step"
import { SubjectMeetingStep } from "@/app/request-tutor/steps/subject-meeting-step"
import { BudgetPreferencesStep } from "@/app/request-tutor/steps/budget-preferences-step"
import { formSchema } from "./util/request-schema"
import { useUser } from "@/contexts/UserContext"
import FormNavigationButton from "./submitForm"

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

export const REQUEST_STEPS = [
  { title: "Email Address", Component: EmailVerificationStep, fields: ["email"] },
  { title: "Basic Details", Component: NameAddressStep, fields: ["name", "street"] },
  { title: "Contact Info", Component: PhoneNumberStep, fields: ["phone_number"] },
  { title: "Requirements", Component: RequirementDescriptionStep, fields: ["description"] },
  { title: "Subject & Meeting", Component: SubjectMeetingStep, fields: ["subject", "level", "type", "meeting_options"] },
  { title: "Budget & Preferences", Component: BudgetPreferencesStep, fields: ["price_amount", "price_option", "price_currency", "price_currency_symbol", "gender_preference", "tutors_want", "i_need_someone", "language", "get_tutors_from"] },
]

export default function RequestTutorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const searchParams = useSearchParams()
  const { user, profile, signInWithMagicLink } = useUser()
  const [resendTimer, setResendTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);

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
        addressline_1: profile?.address?.addressline_1 || "",
        addressline_2: profile?.address?.addressline_2 || "",
        country: profile?.address?.country || "",
        country_code: profile?.address?.country_code || "",
        street: profile?.address?.street || "",
        city: profile?.address?.city || "",
        state: profile?.address?.state || "",
        zip: profile?.address?.zip || "",
        abbreviation_STD: profile?.address?.abbreviation_STD || "",
        offset_STD: profile?.address?.offset_STD || "",
        lat: profile?.address?.lat || 0,
        lon: profile?.address?.lon || 0,
      },
      phone_number: profile?.phone_number || "",
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

  useEffect(() => {
    if (user && currentStep === 0) {
      setCurrentStep(1)
    } 
    if (user && currentStep === 1 && profile.address) {
      setCurrentStep(2)
    }
    if (user && currentStep === 2 && profile.phone_number) {
      setCurrentStep(3)
    }
    setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 50);
  }, [user, currentStep])

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

      {!isSubmitting ? (
        <Card className="shadow-none border-0">
          <CardContent className="pt-6">
            <Form {...form}>
              <form>
                <div className="space-y-6">
                  <div className="pb-12 border-b border-gray-900/10">
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