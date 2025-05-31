import { Suspense } from "react"
import RequestBrowser from "./components/request-browser"
import { Card, CardContent } from "@/components/ui/card"

const sampleRequests = [
  {
    id: 1,
    type: "tutoring",
    level: "Beginner",
    tutors_want: "1",
    gender_preference: "Any",
    description:
      "Need help with calculus and algebra. Struggling with derivatives and basic algebraic equations. Looking for patient tutor who can explain concepts clearly.",
    nature: "Regular",
    online_meeting: true,
    offline_meeting: false,
    travel_meeting: false,
    price_amount: "100.00",
    price_currency_symbol: "₹",
    price_option: "fixed",
    i_need_someone: "urgent",
    language: [
      { label: "English", value: "en" },
      { label: "Hindi", value: "hi" },
    ],
    subjects: [{ name: "Mathematics" }],
    address: {
      city: "Kolkata",
      state: "West Bengal",
    },
  },
  {
    id: 2,
    type: "assignment",
    level: "Intermediate",
    tutors_want: "1",
    gender_preference: "Female",
    description:
      "Need assistance with organic chemistry assignment. Topics include reaction mechanisms and stereochemistry.",
    nature: "One-time",
    online_meeting: true,
    offline_meeting: true,
    travel_meeting: false,
    price_amount: "500.00",
    price_currency_symbol: "₹",
    price_option: "fixed",
    i_need_someone: "within a week",
    language: [{ label: "English", value: "en" }],
    subjects: [{ name: "Chemistry" }],
    address: {
      city: "Mumbai",
      state: "Maharashtra",
    },
  },
  {
    id: 3,
    type: "job support",
    level: "Advanced",
    tutors_want: "1",
    gender_preference: "Any",
    description:
      "Looking for React.js and Node.js mentor for ongoing project support. Need help with best practices and code reviews.",
    nature: "Regular",
    online_meeting: true,
    offline_meeting: false,
    travel_meeting: false,
    price_amount: "2000.00",
    price_currency_symbol: "₹",
    price_option: "hourly",
    i_need_someone: "flexible",
    language: [{ label: "English", value: "en" }],
    subjects: [{ name: "Computer Science" }, { name: "Programming" }],
    address: {
      city: "Bangalore",
      state: "Karnataka",
    },
  },
  {
    id: 4,
    type: "tutoring",
    level: "Beginner",
    tutors_want: "1",
    gender_preference: "Any",
    description: "Physics concepts for class 12 board exams. Need help with mechanics, thermodynamics, and optics.",
    nature: "Regular",
    online_meeting: false,
    offline_meeting: true,
    travel_meeting: true,
    price_amount: "800.00",
    price_currency_symbol: "₹",
    price_option: "fixed",
    i_need_someone: "urgent",
    language: [
      { label: "Hindi", value: "hi" },
      { label: "English", value: "en" },
    ],
    subjects: [{ name: "Physics" }],
    address: {
      city: "Delhi",
      state: "Delhi",
    },
  },
  {
    id: 5,
    type: "tutoring",
    level: "Intermediate",
    tutors_want: "1",
    gender_preference: "Male",
    description: "Spanish language learning for conversational fluency. Focus on grammar and pronunciation.",
    nature: "Regular",
    online_meeting: true,
    offline_meeting: true,
    travel_meeting: false,
    price_amount: "600.00",
    price_currency_symbol: "₹",
    price_option: "hourly",
    i_need_someone: "within a week",
    language: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
    ],
    subjects: [{ name: "Spanish" }, { name: "Languages" }],
    address: {
      city: "Pune",
      state: "Maharashtra",
    },
  },
  {
    id: 6,
    type: "assignment",
    level: "Advanced",
    tutors_want: "1",
    gender_preference: "Any",
    description:
      "Data structures and algorithms assignment help. Need assistance with graph algorithms and dynamic programming.",
    nature: "One-time",
    online_meeting: true,
    offline_meeting: false,
    travel_meeting: false,
    price_amount: "1500.00",
    price_currency_symbol: "₹",
    price_option: "fixed",
    i_need_someone: "urgent",
    language: [{ label: "English", value: "en" }],
    subjects: [{ name: "Computer Science" }, { name: "Programming" }],
    address: {
      city: "Hyderabad",
      state: "Telangana",
    },
  },
  {
    id: 7,
    type: "tutoring",
    level: "Beginner",
    tutors_want: "1",
    gender_preference: "Female",
    description: "English literature analysis and essay writing. Preparing for university entrance exams.",
    nature: "Regular",
    online_meeting: true,
    offline_meeting: true,
    travel_meeting: false,
    price_amount: "400.00",
    price_currency_symbol: "₹",
    price_option: "hourly",
    i_need_someone: "flexible",
    language: [{ label: "English", value: "en" }],
    subjects: [{ name: "English" }, { name: "Literature" }],
    address: {
      city: "Chennai",
      state: "Tamil Nadu",
    },
  },
  {
    id: 8,
    type: "job support",
    level: "Intermediate",
    tutors_want: "1",
    gender_preference: "Any",
    description: "Digital marketing strategy and SEO optimization. Need guidance for e-commerce business.",
    nature: "Regular",
    online_meeting: true,
    offline_meeting: false,
    travel_meeting: false,
    price_amount: "1200.00",
    price_currency_symbol: "₹",
    price_option: "hourly",
    i_need_someone: "within a week",
    language: [
      { label: "English", value: "en" },
      { label: "Hindi", value: "hi" },
    ],
    subjects: [{ name: "Marketing" }, { name: "Business" }],
    address: {
      city: "Kolkata",
      state: "West Bengal",
    },
  },
]

export default function BrowseRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Student Requests</h1>
          <p className="text-gray-600">Find tutoring opportunities that match your expertise</p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <RequestBrowser initialRequests={sampleRequests} />
        </Suspense>
      </div>
    </div>
  )
}
