# Mentoring Platform Database Schema

This document describes the complete database schema for the mentoring platform built with Supabase.

## Overview

The platform connects students with tutors for personalized learning experiences. The database supports:
- User authentication and profiles
- Tutor profiles and availability
- Request and application system
- Session booking and management
- Messaging and notifications
- Reviews and ratings
- Payment tracking

## Database Tables

### Core Tables

#### `users`
Main user table for both students and tutors.
```sql
- id (uuid, primary key)
- email (text, unique)
- name (text)
- role (text: 'student', 'tutor', 'admin')
- phone_number (text)
- bio (text)
- avatar_url (text)
- rating (numeric)
- total_reviews (integer)
- address_id (uuid, foreign key)
- profile_completion_percentage (integer)
- verification fields (email_verified, phone_verified, government_id_verified)
```

#### `tutors`
Extended profile information for tutors.
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- hourly_rate (numeric)
- experience_years (integer)
- education (text)
- languages (text[])
- response_time (text)
- availability_status (text)
- verified (boolean)
- preferred_meeting_types (text[])
- total_sessions (integer)
- success_rate (numeric)
```

#### `subjects`
Available subjects for tutoring.
```sql
- id (uuid, primary key)
- name (text, unique)
- description (text)
- category (text)
```

#### `tutor_subjects`
Many-to-many relationship between tutors and subjects.
```sql
- tutor_id (uuid, foreign key)
- subject_id (uuid, foreign key)
- proficiency_level (text)
- years_experience (integer)
- hourly_rate_override (numeric)
```

### Request System

#### `requests`
Student requests for tutoring.
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- description (text)
- type (text: 'Tutoring', 'Job Support', 'Assignment')
- level (text)
- status (text)
- price_amount (numeric)
- meeting preferences (online_meeting, offline_meeting, travel_meeting)
- urgency (text)
```

#### `applications`
Tutor applications to requests.
```sql
- id (uuid, primary key)
- request_id (uuid, foreign key)
- tutor_id (uuid, foreign key)
- message (text)
- proposed_rate (numeric)
- status (text: 'pending', 'accepted', 'rejected')
```

### Session Management

#### `sessions`
Individual tutoring sessions.
```sql
- id (uuid, primary key)
- student_id (uuid, foreign key)
- tutor_id (uuid, foreign key)
- subject_id (uuid, foreign key)
- scheduled_start (timestamptz)
- scheduled_end (timestamptz)
- status (text)
- total_amount (numeric)
- payment_status (text)
- meeting_link (text)
- notes (text)
```

#### `tutor_availability`
Tutor availability schedules.
```sql
- id (uuid, primary key)
- tutor_id (uuid, foreign key)
- day_of_week (integer: 0-6)
- start_time (time)
- end_time (time)
- timezone (text)
- is_recurring (boolean)
```

### Communication

#### `messages`
Direct messages between users.
```sql
- id (uuid, primary key)
- sender_id (uuid, foreign key)
- recipient_id (uuid, foreign key)
- content (text)
- read (boolean)
- request_id (uuid, optional foreign key)
```

#### `notifications`
System notifications.
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- type (text)
- title (text)
- message (text)
- read (boolean)
- action_url (text)
```

### Reviews and Ratings

#### `reviews`
User reviews and ratings.
```sql
- id (uuid, primary key)
- reviewer_id (uuid, foreign key)
- reviewee_id (uuid, foreign key)
- request_id (uuid, foreign key)
- rating (integer: 1-5)
- comment (text)
- response (text, optional)
```

## Database Views

### `tutor_search_view`
Optimized view for tutor search functionality:
```sql
SELECT 
  t.id,
  u.name,
  u.avatar_url,
  u.rating,
  u.total_reviews,
  t.hourly_rate,
  t.experience_years,
  t.response_time,
  t.availability_status,
  t.verified,
  CONCAT(a.city, ', ', a.state) as location,
  array_agg(DISTINCT s.name) as subjects
FROM tutors t
JOIN users u ON t.user_id = u.id
LEFT JOIN addresses a ON u.address_id = a.id
LEFT JOIN tutor_subjects ts ON t.id = ts.tutor_id
LEFT JOIN subjects s ON ts.subject_id = s.id
WHERE t.verified = true AND u.status = 'active'
GROUP BY t.id, u.id, a.id;
```

## API Usage Examples

### Finding Tutors
```javascript
import { getAllTutors, searchTutors } from '@/lib/supabaseAPI'

// Get all verified tutors
const { data: tutors } = await getAllTutors()

// Search with filters
const { data: filteredTutors } = await searchTutors({
  searchQuery: 'mathematics',
  subjects: ['Mathematics', 'Physics'],
  minPrice: 20,
  maxPrice: 100,
  minRating: 4.0,
  sortBy: 'rating'
})
```

### Creating Requests
```javascript
import { createTutorRequest } from '@/lib/supabaseAPI'

const requestData = {
  user_id: userId,
  title: 'Need help with Calculus',
  description: 'Looking for help with differential equations',
  type: 'Tutoring',
  level: 'University',
  price_amount: 50,
  online_meeting: true,
  offline_meeting: false
}

const { data: request } = await createTutorRequest(requestData)
```

### Booking Sessions
```javascript
import { bookSession } from '@/lib/supabaseAPI'

const sessionData = {
  student_id: studentId,
  tutor_id: tutorId,
  subject_id: subjectId,
  title: 'Calculus Tutoring Session',
  scheduled_start: '2025-07-25T14:00:00Z',
  scheduled_end: '2025-07-25T15:00:00Z',
  session_type: 'online',
  hourly_rate: 45,
  total_amount: 45
}

const { data: session } = await bookSession(sessionData)
```

## Running Migrations

1. **Initial Schema**: Run the main migration file
```bash
supabase migration new initial_schema
# Copy content from 20250723152224_violet_wildflower.sql
supabase db reset
```

2. **Additional Tables**: Run the tutors and additional tables migration
```bash
supabase migration new tutors_and_additional_tables
# Copy content from 20250724000000_tutors_and_additional_tables.sql
supabase db push
```

3. **Seed Data**: Populate with sample data
```bash
# Run the seed_data.sql file in Supabase dashboard or CLI
supabase db seed
```

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users**: Can read/update own data
- **Tutors**: Anyone can read verified profiles, tutors manage own
- **Requests**: Anyone can read open requests, users manage own
- **Sessions**: Users can see own sessions (student or tutor)
- **Messages**: Users can read own conversations
- **Reviews**: Anyone can read, users can create for their sessions

## Triggers and Functions

### Automatic Rating Updates
When a review is added, the `update_user_rating()` function automatically recalculates the user's average rating and total review count.

### Profile Completion
The `calculate_profile_completion()` function runs on user updates to track profile completion percentage.

### Timestamp Updates
All tables with `updated_at` columns have triggers to automatically update timestamps.

## Performance Optimizations

- Indexed foreign keys and frequently queried columns
- Optimized view for tutor search
- Pagination support in API functions
- Efficient RLS policies

## Next Steps

1. Set up real-time subscriptions for messages and notifications
2. Implement file upload for profile pictures and documents
3. Add payment integration tables
4. Set up automated email notifications
5. Implement advanced search with full-text search capabilities

## Environment Variables

Make sure to set these in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
