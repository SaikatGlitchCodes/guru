
import * as yup from "yup"
import { Award, Crown, Shield, Zap, Trophy, Medal } from 'lucide-react';

export const baseUserSchema = {
  email: yup
    .string()
    .email("Please enter a valid email address format")
    .optional(),
  name: yup
    .string()
    .min(2, "Your name must contain at least 2 characters")
    .required("Please enter your name"),
  role: yup
    .string()
    .oneOf(["student", "tutor"], "Please select a valid role")
    .required("Please select your role"),
  phone_number: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  gender: yup
    .string()
    .optional(),
  bio: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  years_of_experience: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Experience years cannot be negative")
    .optional(),
  hobbies: yup
    .string()
    .optional()
    .transform(value => value === '' ? undefined : value),
  status: yup
    .string()
    .oneOf(["active", "inactive", "ban"], "Invalid account status")
    .optional(),
  coin_balance: yup
    .number()
    .optional(),
  rating: yup
    .number()
    .optional(),
  total_reviews: yup
    .number()
    .optional(),
  timezone: yup
    .string()
    .optional(),
  preferred_language: yup
    .string()
    .optional(),
  profile_completion_percentage: yup
    .number()
    .optional(),
  email_verified: yup
    .boolean()
    .optional(),
  phone_verified: yup
    .boolean()
    .optional(),
  government_id_verified: yup
    .boolean()
    .optional(),
  address: yup.object({
    id: yup.string().nullable().optional(),
    street: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    zip: yup.string().optional(),
    country: yup.string().optional(),
    country_code: yup.string().optional(),
    lat: yup.number().nullable().optional(),
    lon: yup.number().nullable().optional(),
    address_line_1: yup.string().nullable().optional(),
    address_line_2: yup.string().nullable().optional(),
    formatted: yup.string().optional(),
  }).optional(),
}

export const tutorSchema = {
  ...baseUserSchema,
  tutor: yup.object({
    hourly_rate: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .min(0, "Hourly rate cannot be negative")
      .required("Please enter your hourly rate"),
    experience_years: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .min(0, "Experience years cannot be negative")
      .optional(),
    education: yup
      .string()
      .optional(),
    certifications: yup
      .array()
      .of(yup.string())
      .optional(),
    languages: yup
      .array()
      .of(yup.string())
      .optional(),
    teaching_style: yup
      .string()
      .optional(),
    specializations: yup
      .array()
      .of(yup.string())
      .optional(),
    response_time: yup
      .string()
      .optional(),
    availability_status: yup
      .string()
      .oneOf(['available', 'busy', 'away'], 'Invalid availability status')
      .optional(),
    verified: yup
      .boolean()
      .optional(),
    verification_documents: yup
      .array()
      .of(yup.string())
      .optional(),
    background_check: yup
      .boolean()
      .optional(),
    preferred_meeting_types: yup
      .array()
      .of(yup.string())
      .optional(),
    travel_radius_km: yup
      .number()
      .transform((value) => (isNaN(value) ? 10 : value))
      .min(0, "Travel radius cannot be negative")
      .optional(),
    minimum_session_duration: yup
      .number()
      .transform((value) => (isNaN(value) ? 60 : value))
      .min(15, "Minimum session duration must be at least 15 minutes")
      .optional(),
    cancellation_policy: yup
      .string()
      .optional(),
    instant_booking: yup
      .boolean()
      .optional(),
  }).optional(),
}

export const createProfileSchema = (role) =>  yup.object(role === 'tutor' ? tutorSchema : baseUserSchema).required("Please complete the form");

export const overallForm = yup.object(baseUserSchema).required("Please complete the form");

export const formData = (profile, user) => {
  console.log('Initializing form data with:', profile.role);
  const initialData = {
    user_id: user.id,
    profile_id: profile.id,
    email: profile.email || "",
    avatar: profile.avatar_url || user.user_metadata?.picture || user.user_metadata?.avatar_url || "/placeholder.svg?height=100&width=100",
    name: profile.name || "",
    role: profile.role || "student",
    phone_number: profile.phone_number || "",
    gender: profile.gender || "",
    bio: profile.bio || "",
    years_of_experience: profile.years_of_experience || 0,
    hobbies: profile.hobbies || "",
    status: profile.status || "active",
    rating: profile.rating || 0,
    total_reviews: profile.total_reviews || 0,
    coin_balance: profile.coin_balance || 0,
    timezone: profile.timezone || "UTC",
    preferred_language: profile.preferred_language || "English",
    profile_completion_percentage: profile.profile_completion_percentage || 0,
    email_verified: profile.email_verified || false,
    phone_verified: profile.phone_verified || false,
    government_id_verified: profile.government_id_verified || false,
    address: {
      id: profile.address?.id || null,
      street: profile.address?.street || "",
      city: profile.address?.city || "",
      state: profile.address?.state || "",
      zip: profile.address?.zip || "",
      country: profile.address?.country || "",
      country_code: profile.address?.country_code || "",
      address_line_1: profile.address?.address_line_1 || "",
      address_line_2: profile.address?.address_line_2 || "",
      lat: profile.address?.lat || 0,
      lon: profile.address?.lon || 0,
      formatted: profile.address?.formatted || ""
    },
    isUploadingProfileImage: false
  }
  if (profile.role == 'tutor') {
    initialData.tutor = {
      id: profile.tutor?.id || null,
      hourly_rate: profile.tutor?.hourly_rate || 0,
      experience_years: profile.tutor?.experience_years || 0,
      education: profile.tutor?.education || "",
      certifications: profile.tutor?.certifications || [],
      languages: profile.tutor?.languages || [],
      teaching_style: profile.tutor?.teaching_style || "",
      specializations: profile.tutor?.specializations || [],
      response_time: profile.tutor?.response_time || "< 24 hours",
      availability_status: profile.tutor?.availability_status || "available",
      verified: profile.tutor?.verified || false,
      verification_documents: profile.tutor?.verification_documents || [],
      background_check: profile.tutor?.background_check || false,
      preferred_meeting_types: profile.tutor?.preferred_meeting_types || [],
      travel_radius_km: profile.tutor?.travel_radius_km || 10,
      minimum_session_duration: profile.tutor?.minimum_session_duration || 60,
      cancellation_policy: profile.tutor?.cancellation_policy || "",
      instant_booking: profile.tutor?.instant_booking || false,
    }
  }

  return initialData;
};

export const getBadgeInfo = (rating) => {
  if (rating >= 4.8) {
    return {
      title: "Ultimate Tutor",
      icon: Crown,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      description: "Top 1% of tutors",
      tooltip: "Ultimate Tutors are the cream of the crop with ratings of 4.8+ stars. They consistently deliver exceptional learning experiences and have outstanding student feedback."
    };
  } else if (rating >= 4.5) {
    return {
      title: "Super Tutor",
      icon: Trophy,
      color: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      description: "Elite performer",
      tooltip: "Super Tutors maintain ratings between 4.5-4.7 stars. They are highly skilled educators with excellent teaching methods and strong student satisfaction."
    };
  } else if (rating >= 4.0) {
    return {
      title: "Expert Tutor",
      icon: Shield,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      description: "Highly rated",
      tooltip: "Expert Tutors have ratings between 4.0-4.4 stars. They demonstrate solid teaching skills and consistently help students achieve their learning goals."
    };
  } else if (rating >= 3.5) {
    return {
      title: "Pro Tutor",
      icon: Zap,
      color: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
      description: "Skilled educator",
      tooltip: "Pro Tutors maintain ratings between 3.5-3.9 stars. They show good teaching abilities and positive student interactions with room for growth."
    };
  } else if (rating >= 3.0) {
    return {
      title: "Certified Tutor",
      icon: Medal,
      color: "bg-gradient-to-r from-gray-600 to-gray-700 text-white",
      description: "Qualified tutor",
      tooltip: "Certified Tutors have ratings between 3.0-3.4 stars. They meet basic teaching standards and are working to improve their tutoring skills."
    };
  } else {
    return {
      title: "New Tutor",
      icon: Award,
      color: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
      description: "Starting journey",
      tooltip: "New Tutors are just beginning their journey with us. They may have limited reviews but are eager to help students learn and grow."
    };
  }
};