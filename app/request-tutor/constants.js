import { EmailVerificationStep } from "@/app/request-tutor/steps/email-verification-step"
import { NameAddressStep } from "@/app/request-tutor/steps/name-address-step"
import { PhoneNumberStep } from "@/app/request-tutor/steps/phone-number-step"
import { RequirementDescriptionStep } from "@/app/request-tutor/steps/requirement-description-step"
import { SubjectMeetingStep } from "@/app/request-tutor/steps/subject-meeting-step"
import { BudgetPreferencesStep } from "@/app/request-tutor/steps/budget-preferences-step"

export const REQUEST_STEPS = [
  { title: "Email Address", Component: EmailVerificationStep, fields: ["user_email"] },
  { title: "Basic Details", Component: NameAddressStep, fields: ["name", "street"] },
  { title: "Contact Info", Component: PhoneNumberStep, fields: ["phone_number"] },
  { title: "Requirements", Component: RequirementDescriptionStep, fields: ["description"] },
  { title: "Subject & Meeting", Component: SubjectMeetingStep, fields: ["subject", "level", "type", "meeting_options"] },
  { title: "Budget & Preferences", Component: BudgetPreferencesStep, fields: ["price_amount", "price_option", "price_currency", "price_currency_symbol", "gender_preference", "tutors_want", "i_need_someone", "language", "get_tutors_from"] },
]
