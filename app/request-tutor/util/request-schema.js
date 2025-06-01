// util/request-schema.ts
import { z } from "zod";

export const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.object({
    addressline_1: z.string().optional(),
    addressline_2: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    country_code: z.string().optional(),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().optional(),
    abbreviation_STD: z.string().optional(),
    offset_STD: z.string().optional(),
    lat: z.string().optional(),
    lon: z.string().optional(),
  }),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
  description: z.string()
    .min(20, "Please describe your requirements in at least 20 characters"),
  subject: z.array(z.string())
    .min(1, "Please select at least one subject"),
  level: z.string().min(1, "Please select your level"),
  meeting_options: z.object({
    Online: z.object({ state: z.boolean() }),
    Offline: z.object({ state: z.boolean() }),
    Travel: z.object({ state: z.boolean() }),
  }).refine(
    (data) => data.Online.state || data.Offline.state || data.Travel.state,
    { message: "Please select at least one meeting option" }
  ),
  price_amount: z.number().min(0, "Please enter your budget"),
  price_option: z.string().optional(),
  price_currency: z.string().optional(),
  price_currency_symbol: z.string().optional(),
  gender_preference: z.string().min(1, "Please select gender preference"),
  tutors_want: z.string().min(1, "Please select tutor preference"),
  i_need_someone: z.string().min(1, "Please select availability preference"),
  language: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ).min(1, "Please select at least one language"),
  get_tutors_from: z.string().optional(),
  upload_file: z.any().optional(),
});
