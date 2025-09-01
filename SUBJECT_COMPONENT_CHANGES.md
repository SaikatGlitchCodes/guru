# Subject Component Changes Summary

## Overview
Recreated the subject component specifically for tutors to use the `tutor_subjects` table instead of `user_subjects`, and enhanced it with all the fields from the tutor_subjects schema.

## Database Schema Changes Made

### Removed Dependencies
- **user_subjects table usage for tutors**: Tutors now exclusively use `tutor_subjects`
- **Legacy user subject functions for tutors**: Replaced with tutor-specific implementations

### Enhanced tutor_subjects Integration
The component now fully utilizes all fields from the `tutor_subjects` table:
- `id`: uuid (PK)
- `tutor_id`: uuid (FK → tutors.id)
- `subject_id`: uuid (FK → subjects.id) 
- `proficiency_level`: text (beginner, intermediate, advanced, expert)
- `years_experience`: integer (years of experience in this subject)
- `hourly_rate_override`: numeric (custom rate for this specific subject)
- `created_at`: timestamp with time zone

## API Functions Added/Updated

### New Functions
1. **getTutorSubjectsByEmail(userEmail)**: Get tutor's subjects by email
2. **addTutorSubjectByEmail(userEmail, subjectId, proficiencyData)**: Add subject with proficiency details
3. **updateTutorSubjectByEmail(userEmail, tutorSubjectId, proficiencyData)**: Update subject proficiency
4. **removeTutorSubjectByEmail(userEmail, subjectId)**: Remove tutor subject

### Enhanced Functions
1. **updateProfile()**: Now handles tutor data updates including tutor table updates
2. **getOrCreateUser()**: Now loads tutor data alongside user data

## UI Component Changes

### Enhanced Subject Management
- **Tutor-specific subject cards**: Show proficiency level, experience, and custom rates
- **Proficiency modal**: Add/edit subjects with detailed proficiency information
- **Real-time updates**: Edit proficiency details inline
- **Visual indicators**: Badges for proficiency levels and experience

### Modal Fields
- **Proficiency Level**: Dropdown (Beginner, Intermediate, Advanced, Expert)
- **Years of Experience**: Number input for subject-specific experience
- **Custom Hourly Rate**: Optional override rate for specific subjects

### Student Compatibility
- Students continue to use the simplified `user_subjects` system
- Clean separation between tutor and student subject management

## Key Features

### For Tutors
1. **Comprehensive Subject Profiles**: Each subject includes proficiency, experience, and optional custom rate
2. **Professional Presentation**: Subject cards show expertise level and experience
3. **Flexible Pricing**: Set different rates for different subjects
4. **Easy Management**: Add, edit, and remove subjects with full control

### For Students
1. **Simple Interface**: Basic subject selection without complexity
2. **Backward Compatibility**: Existing student functionality preserved

## Technical Implementation

### State Management
```javascript
const [tutorSubjects, setTutorSubjects] = useState([]);
const [subjectProficiency, setSubjectProficiency] = useState({
  proficiency_level: 'intermediate',
  years_experience: 0,
  hourly_rate_override: null
});
```

### Conditional Rendering
- Different UI components based on user role (tutor vs student)
- Enhanced subject cards for tutors with edit capabilities
- Simple badges for students

### Data Flow
1. Load subjects using role-appropriate API calls
2. Display subjects with role-specific UI components
3. Handle CRUD operations through dedicated tutor functions
4. Update local state and show success/error feedback

## Migration Path

### For Existing Users
- Students: No changes required
- Tutors: Will see enhanced subject management on next login
- Existing data: Preserved in respective tables

### Database Cleanup (Recommended)
- Remove `user_subjects` entries for users with role='tutor'
- Migrate any existing tutor subject data to `tutor_subjects` table
- Add database constraints to prevent tutors from using `user_subjects`

## Files Modified

1. **lib/supabaseAPI.js**
   - Added tutor-specific subject management functions
   - Enhanced updateProfile to handle tutor data
   - Updated getOrCreateUser to load tutor data

2. **app/(auth)/profile/page.jsx**
   - Added tutor subject state management
   - Created proficiency modal component
   - Enhanced subject display for tutors
   - Added edit/update functionality

## Benefits

1. **Professional Presentation**: Tutors can showcase expertise levels
2. **Flexible Pricing**: Subject-specific rates for better market positioning
3. **Better Matching**: Students can find tutors with appropriate experience levels
4. **Clean Architecture**: Proper separation between tutor and student data models
5. **Scalability**: Easy to add more tutor-specific fields in the future

## Next Steps

1. **Database Migration**: Clean up any existing user_subjects entries for tutors
2. **Testing**: Thoroughly test both tutor and student workflows
3. **Documentation**: Update API documentation for new functions
4. **Performance**: Add indexing for tutor_subjects queries if needed
5. **Analytics**: Track usage of new proficiency features
