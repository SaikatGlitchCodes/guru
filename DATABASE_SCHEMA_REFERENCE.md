# Database Schema Reference

## Overview
- **Database Type:** PostgreSQL (Supabase)
- **Total Tables:** 22
- **Generated:** 2025-08-10T04:34:43.844Z
- **Last Updated:** 2025-08-10

## Table Summary

| Table Name | Primary Purpose | Record Count | Status |
|------------|----------------|--------------|--------|
| `users` | Core user profiles | 8 | ✅ Active |
| `addresses` | Location data | 8 | ✅ Active |
| `subjects` | Available tutoring subjects | 36 | ✅ Active |
| `requests` | Tutoring requests | ? | ✅ Active |
| `request_subjects` | Links requests to subjects | 56 | ✅ Active |
| `messages` | Communication system | 13 | ✅ Active |
| `tutors` | Tutor-specific profiles | 6 | ✅ Active |
| `applications` | Tutor applications to requests | ? | ✅ Active |
| `sessions` | Tutoring sessions | ? | ✅ Active |
| `reviews` | Rating and feedback system | ? | ✅ Active |
| `payments` | Payment records | ? | ✅ Active |
| `payment_transactions` | Stripe/payment processing | 0 | ✅ Active |
| `transactions` | Coin/credit transactions | ? | ✅ Active |
| `notifications` | User notifications | ? | ✅ Active |
| `file_uploads` | File management | ? | ✅ Active |
| `contact_activities` | Tutor contact tracking | ? | ✅ Active |
| `availability_slots` | Tutor availability | ? | ✅ Active |
| `tutor_availability` | Legacy availability | ? | ✅ Active |
| `tutor_subjects` | Tutor subject expertise | ? | ✅ Active |
| `user_subjects` | Student subject interests | ? | ✅ Active |
| `user_preferences` | User settings | ? | ✅ Active |
| `session_participants` | Session attendance | ? | ✅ Active |

## Detailed Table Structures

### Core User System

#### `users` (Primary user profiles)
```sql
- id: uuid (PK, gen_random_uuid())
- email: text (NOT NULL, unique identifier)
- name: text (NOT NULL)
- role: text (NOT NULL) -- 'student', 'tutor', 'admin'
- phone_number: text
- gender: text
- bio: text
- years_of_experience: numeric (default: 0)
- hobbies: text
- status: text (default: 'active')
- coin_balance: integer (default: 0)
- avatar_url: text
- rating: numeric (default: 0)
- total_reviews: integer (default: 0)
- address_id: uuid (FK → addresses.id)
- last_active: timestamp with time zone (default: now())
- timezone: text (default: 'UTC')
- preferred_language: text (default: 'English')
- profile_completion_percentage: integer (default: 0)
- email_verified: boolean (default: false)
- phone_verified: boolean (default: false)
- government_id_verified: boolean (default: false)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `addresses` (Location data)
```sql
- id: uuid (PK, gen_random_uuid())
- street: text
- city: text
- state: text
- zip: text
- country: text
- country_code: text
- lat: numeric (latitude)
- lon: numeric (longitude)
- address_line_1: text
- address_line_2: text
- formatted: text (complete formatted address)
- created_at: timestamp with time zone (default: now())
```

#### `tutors` (Extended tutor profiles)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- hourly_rate: numeric (NOT NULL, default: 0)
- experience_years: integer (default: 0)
- education: text
- certifications: text[] (array)
- languages: text[] (array, default: '{}')
- teaching_style: text
- specializations: text[] (array)
- response_time: text (default: '< 24 hours')
- availability_status: text (default: 'available')
- verified: boolean (default: false)
- verification_documents: text[] (array)
- background_check: boolean (default: false)
- preferred_meeting_types: text[] (array, default: '{}')
- travel_radius_km: integer (default: 10)
- minimum_session_duration: integer (default: 60)
- cancellation_policy: text
- instant_booking: boolean (default: false)
- total_sessions: integer (default: 0)
- total_earnings: numeric (default: 0)
- success_rate: numeric (default: 0)
- response_rate: numeric (default: 0)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

### Request System

#### `requests` (Tutoring requests)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- address_id: uuid (FK → addresses.id)
- title: text
- description: text (NOT NULL)
- type: text (NOT NULL) -- 'tutoring', 'assignment', 'job support'
- level: text (NOT NULL) -- difficulty level
- status: text (default: 'open') -- 'open', 'closed', 'in_progress'
- price_amount: numeric (NOT NULL)
- price_option: text (NOT NULL) -- 'per_hour', 'fixed', 'per_session'
- price_currency: text (default: 'USD')
- price_currency_symbol: text (default: '$')
- gender_preference: text (default: 'None')
- tutors_want: text (default: 'Only one')
- i_need_someone: text (default: 'part time')
- language: jsonb (default: '[]')
- get_tutors_from: text
- online_meeting: boolean (default: false)
- offline_meeting: boolean (default: false)
- travel_meeting: boolean (default: false)
- urgency: text (default: 'flexible') -- 'urgent', 'flexible', 'scheduled'
- view_count: integer (default: 0)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `subjects` (Available subjects)
```sql
- id: uuid (PK, gen_random_uuid())
- name: text (NOT NULL)
- description: text
- category: text
- icon: text
- difficulty_level: text
- hourly_rate_min: numeric (default: 0)
- hourly_rate_max: numeric (default: 0)
- is_active: boolean (default: true)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `request_subjects` (Many-to-many: requests ↔ subjects)
```sql
- id: uuid (PK, gen_random_uuid())
- request_id: uuid (FK → requests.id, NOT NULL)
- subject_id: uuid (FK → subjects.id, NOT NULL)
- created_at: timestamp with time zone (default: now())
```

#### `applications` (Tutor applications to requests)
```sql
- id: uuid (PK, gen_random_uuid())
- request_id: uuid (FK → requests.id, NOT NULL)
- tutor_id: uuid (FK → users.id, NOT NULL)
- message: text
- proposed_rate: numeric
- status: text (default: 'pending') -- 'pending', 'accepted', 'rejected'
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

### Session Management

#### `sessions` (Tutoring sessions)
```sql
- id: uuid (PK, gen_random_uuid())
- student_id: uuid (FK → users.id, NOT NULL)
- tutor_id: uuid (FK → users.id, NOT NULL)
- request_id: uuid (FK → requests.id)
- subject_id: uuid (FK → subjects.id)
- title: text (NOT NULL)
- description: text
- session_type: text (NOT NULL) -- 'online', 'in_person', 'travel'
- status: text (default: 'scheduled') -- 'scheduled', 'ongoing', 'completed', 'cancelled'
- scheduled_start: timestamp with time zone (NOT NULL)
- scheduled_end: timestamp with time zone (NOT NULL)
- actual_start: timestamp with time zone
- actual_end: timestamp with time zone
- meeting_link: text
- meeting_location: text
- hourly_rate: numeric (NOT NULL)
- total_amount: numeric (NOT NULL)
- payment_status: text (default: 'pending')
- notes: text
- homework: text
- materials_shared: text[] (array)
- recording_url: text
- cancelled_by: uuid (FK → users.id)
- cancellation_reason: text
- cancelled_at: timestamp with time zone
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `session_participants` (Session attendance tracking)
```sql
- id: uuid (PK, gen_random_uuid())
- session_id: uuid (FK → sessions.id, NOT NULL)
- user_id: uuid (FK → users.id, NOT NULL)
- role: text (NOT NULL) -- 'student', 'tutor', 'observer'
- joined_at: timestamp with time zone
- left_at: timestamp with time zone
- attendance_status: text (default: 'pending')
- created_at: timestamp with time zone (default: now())
```

### Communication System

#### `messages` (Direct messaging)
```sql
- id: uuid (PK, gen_random_uuid())
- sender_id: uuid (FK → users.id, NOT NULL)
- recipient_id: uuid (FK → users.id, NOT NULL)
- request_id: uuid (FK → requests.id)
- content: text (NOT NULL)
- message_type: text (default: 'text') -- 'text', 'file', 'image'
- read: boolean (default: false)
- created_at: timestamp with time zone (default: now())
```

#### `notifications` (System notifications)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- type: text (NOT NULL) -- 'message', 'booking', 'payment', 'reminder'
- title: text (NOT NULL)
- message: text (NOT NULL)
- related_id: uuid
- related_type: text
- read: boolean (default: false)
- action_url: text
- priority: text (default: 'normal') -- 'low', 'normal', 'high', 'urgent'
- scheduled_for: timestamp with time zone
- sent_at: timestamp with time zone
- created_at: timestamp with time zone (default: now())
```

### Payment System

#### `payments` (Payment records)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- session_id: uuid (FK → sessions.id)
- amount: numeric (NOT NULL)
- currency: text (default: 'USD')
- payment_method: text
- transaction_id: text
- status: text (default: 'pending') -- 'pending', 'completed', 'failed', 'refunded'
- payment_type: text -- 'session_payment', 'coin_purchase', 'refund'
- metadata: jsonb
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `payment_transactions` (Stripe integration)
```sql
- id: uuid (PK, gen_random_uuid())
- session_id: text (NOT NULL) -- Stripe session ID
- user_email: text (NOT NULL)
- amount: integer (NOT NULL) -- Amount in cents
- coins: integer (NOT NULL) -- Coins purchased
- status: text (NOT NULL) -- 'pending', 'completed', 'failed'
- payment_method: text (default: 'stripe')
- metadata: jsonb (default: '{}')
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `transactions` (Coin/credit system)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- type: text (NOT NULL) -- 'credit', 'debit', 'purchase', 'refund'
- amount: integer (NOT NULL) -- Coin amount (positive/negative)
- description: text
- reference_id: uuid -- Reference to related record
- status: text (default: 'completed')
- created_at: timestamp with time zone (default: now())
```

### Review System

#### `reviews` (Rating and feedback)
```sql
- id: uuid (PK, gen_random_uuid())
- reviewer_id: uuid (FK → users.id, NOT NULL)
- reviewee_id: uuid (FK → users.id, NOT NULL)
- request_id: uuid (FK → requests.id)
- rating: integer (NOT NULL) -- 1-5 stars
- comment: text
- response: text -- Reviewee's response
- response_date: timestamp with time zone
- helpful_count: integer (default: 0)
- created_at: timestamp with time zone (default: now())
```

### Availability System

#### `availability_slots` (Modern availability)
```sql
- id: uuid (PK, gen_random_uuid())
- tutor_id: uuid (FK → tutors.id, NOT NULL)
- day_of_week: integer (NOT NULL) -- 0=Sunday, 6=Saturday
- start_time: time without time zone (NOT NULL)
- end_time: time without time zone (NOT NULL)
- timezone: text (default: 'UTC')
- is_active: boolean (default: true)
- recurring_weekly: boolean (default: true)
- specific_date: date -- For one-time availability
- max_sessions: integer (default: 1)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

#### `tutor_availability` (Legacy availability - consider deprecating)
```sql
- id: uuid (PK, gen_random_uuid())
- tutor_id: uuid (FK → tutors.id, NOT NULL)
- day_of_week: integer (NOT NULL)
- start_time: time without time zone (NOT NULL)
- end_time: time without time zone (NOT NULL)
- timezone: text (default: 'UTC')
- is_recurring: boolean (default: true)
- specific_date: date
- is_available: boolean (default: true)
- created_at: timestamp with time zone (default: now())
```

### Subject-User Relationships

#### `tutor_subjects` (Tutor expertise)
```sql
- id: uuid (PK, gen_random_uuid())
- tutor_id: uuid (FK → tutors.id, NOT NULL)
- subject_id: uuid (FK → subjects.id, NOT NULL)
- proficiency_level: text (default: 'intermediate')
- years_experience: integer (default: 0)
- hourly_rate_override: numeric -- Override default tutor rate for this subject
- created_at: timestamp with time zone (default: now())
```

#### `user_subjects` (Student interests/expertise)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- subject_id: uuid (FK → subjects.id, NOT NULL)
- proficiency_level: text
- hourly_rate: numeric (default: 0)
- years_of_experience: numeric (default: 0)
- certifications: text[] (array)
- is_verified: boolean (default: false)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

### System Tables

#### `contact_activities` (Tutor contact tracking)
```sql
- id: uuid (PK, gen_random_uuid())
- tutor_email: text (NOT NULL)
- request_id: uuid (FK → requests.id, NOT NULL)
- coin_cost: integer (NOT NULL)
- contacted_at: timestamp with time zone (default: now())
- created_at: timestamp with time zone (default: now())
```

#### `file_uploads` (File management)
```sql
- id: uuid (PK, gen_random_uuid())
- uploader_id: uuid (FK → users.id, NOT NULL)
- filename: text (NOT NULL)
- original_filename: text (NOT NULL)
- file_path: text (NOT NULL)
- file_size: bigint (NOT NULL)
- mime_type: text (NOT NULL)
- file_type: text (NOT NULL)
- related_id: uuid -- FK to related record
- related_type: text -- Type of related record
- is_public: boolean (default: false)
- created_at: timestamp with time zone (default: now())
```

#### `user_preferences` (User settings)
```sql
- id: uuid (PK, gen_random_uuid())
- user_id: uuid (FK → users.id, NOT NULL)
- notification_email: boolean (default: true)
- notification_push: boolean (default: true)
- notification_sms: boolean (default: false)
- marketing_emails: boolean (default: false)
- privacy_level: text (default: 'normal')
- auto_accept_sessions: boolean (default: false)
- preferred_session_duration: integer (default: 60)
- time_buffer_minutes: integer (default: 15)
- max_daily_sessions: integer (default: 8)
- weekend_availability: boolean (default: true)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
```

### Views

#### `tutor_search_view` (Optimized tutor search)
```sql
-- Materialized view combining tutor, user, and address data
- id: uuid (tutor.id)
- name: text (user.name)
- avatar_url: text
- rating: numeric
- total_reviews: integer
- hourly_rate: numeric
- experience_years: integer
- response_time: text
- availability_status: text
- verified: boolean
- languages: text[]
- specializations: text[]
- preferred_meeting_types: text[]
- bio: text
- city: text
- state: text
- country: text
- location: text (formatted)
- subjects: text[] (array of subject names)
- last_active: timestamp with time zone
- instant_booking: boolean
- success_rate: numeric
- response_rate: numeric
- total_sessions: integer
```

## Key Relationships

### Primary Relationships
```
users (1) ←→ (1) addresses
users (1) ←→ (0..1) tutors
users (1) ←→ (*) requests
requests (*) ←→ (*) subjects (via request_subjects)
users (*) ←→ (*) messages (sender/recipient)
sessions (*) → (1) users (student)
sessions (*) → (1) users (tutor)
sessions (*) → (0..1) requests
```

### Application Flow
```
1. User creates request → requests table
2. Request linked to subjects → request_subjects table
3. Tutors apply → applications table
4. Student accepts application → sessions table created
5. Session completed → payments, reviews created
6. Throughout: messages, notifications created
```

## Data Types Reference

| PostgreSQL Type | Description | Example |
|----------------|-------------|---------|
| `uuid` | Universally unique identifier | `gen_random_uuid()` |
| `text` | Variable-length string | Any length text |
| `integer` | 32-bit signed integer | -2147483648 to 2147483647 |
| `numeric` | Arbitrary precision decimal | Money, rates, percentages |
| `boolean` | True/false value | `true`, `false` |
| `timestamp with time zone` | Date and time with timezone | `2025-08-10T04:34:43.844Z` |
| `time without time zone` | Time of day | `14:30:00` |
| `date` | Calendar date | `2025-08-10` |
| `jsonb` | Binary JSON | `{"key": "value"}` |
| `text[]` | Array of text values | `{"English", "Spanish"}` |
| `bigint` | 64-bit signed integer | File sizes, large numbers |

## Status Values Reference

### Request Status
- `open` - Available for tutors to apply
- `in_progress` - Tutoring in progress
- `closed` - Request completed/cancelled

### Application Status
- `pending` - Waiting for student response
- `accepted` - Application approved
- `rejected` - Application declined

### Session Status
- `scheduled` - Upcoming session
- `ongoing` - Session in progress
- `completed` - Session finished
- `cancelled` - Session cancelled

### Payment Status
- `pending` - Payment processing
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### User Status
- `active` - Active user account
- `inactive` - Temporarily disabled
- `suspended` - Account suspended
- `deleted` - Account deleted

## Indexes and Performance

### Recommended Indexes
```sql
-- Core lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_sessions_tutor_id ON sessions(tutor_id);
CREATE INDEX idx_sessions_student_id ON sessions(student_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Time-based queries
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_sessions_scheduled_start ON sessions(scheduled_start);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Search optimization
CREATE INDEX idx_tutor_search_location ON tutors USING gin(to_tsvector('english', coalesce(education, '') || ' ' || coalesce(teaching_style, '')));
```

## Migration Notes

### Known Issues
1. **Duplicate availability tables**: Both `availability_slots` and `tutor_availability` exist
2. **Missing foreign key constraints**: Some relationships lack proper constraints
3. **Inconsistent naming**: Some tables use different naming conventions

### Recommended Improvements
1. Add proper foreign key constraints
2. Consolidate availability tables
3. Add check constraints for status values
4. Create materialized views for complex queries
5. Add full-text search indexes for subjects and descriptions

---

*This reference file should be updated whenever schema changes are made to maintain accuracy.*
