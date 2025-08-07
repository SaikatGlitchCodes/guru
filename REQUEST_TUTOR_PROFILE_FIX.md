# Request Tutor Profile Access Fix

## Problem
Error: `Cannot read properties of null (reading 'address')` in the request-tutor page useEffect.

## Root Cause
The useEffect was trying to access `profile.address` and `profile.phone_number` without first checking if `profile` exists.

## Issue Location
```javascript
// Before (BROKEN):
useEffect(() => {
  if (user && currentStep === 1 && profile.address) {  // ❌ profile could be null
    setCurrentStep(2)
  }
  if (user && currentStep === 2 && profile.phone_number) {  // ❌ profile could be null
    setCurrentStep(3)
  }
}, [user, currentStep])  // ❌ Missing profile dependency
```

## Fix Applied
```javascript
// After (FIXED):
useEffect(() => {
  if (user && currentStep === 0) {
    setCurrentStep(1)
  } 
  if (user && profile && currentStep === 1 && profile.address) {  // ✅ Added profile check
    setCurrentStep(2)
  }
  if (user && profile && currentStep === 2 && profile.phone_number) {  // ✅ Added profile check
    setCurrentStep(3)
  }
  setTimeout(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }, 50);
}, [user, profile, currentStep])  // ✅ Added profile dependency
```

## Changes Made

### 1. **Added Null Checks**
- Added `&& profile` before accessing profile properties
- Prevents null reference errors

### 2. **Fixed Dependencies**
- Added `profile` to the useEffect dependency array
- Ensures effect runs when profile loads

### 3. **Proper Step Advancement Logic**
- Step 0 → 1: User exists (email verified)
- Step 1 → 2: User exists AND profile exists AND address exists
- Step 2 → 3: User exists AND profile exists AND phone number exists

## What This Fixes

- ✅ **No More Null Reference Errors**: Safe property access
- ✅ **Proper Step Advancement**: Only advances when data is actually available
- ✅ **Better User Experience**: Steps advance automatically when profile loads
- ✅ **Reactive Updates**: Responds to profile changes correctly

## Timeline of Execution

1. **Initial Load**: `user = null, profile = null` → Stay on step 0
2. **User Signs In**: `user = {...}, profile = null` → Advance to step 1
3. **Profile Loads**: `user = {...}, profile = {...}` → Check conditions:
   - If `profile.address` exists → Advance to step 2
   - If `profile.phone_number` exists → Advance to step 3

## Testing the Fix

### Test Scenarios:
1. **New User (No Profile)**: Should start at step 0, advance to step 1 after login
2. **User with Address**: Should advance to step 2 automatically
3. **User with Phone**: Should advance to step 3 automatically
4. **Profile Loading Delay**: Should handle async profile loading correctly

### Verification:
1. Open browser console
2. Go to `/request-tutor`
3. Sign in with different user accounts
4. Verify no console errors
5. Check step advancement behavior

## Additional Safety

The form defaultValues already use safe access patterns:
```javascript
// These were already correct:
name: profile?.name || "",
address: {
  street: profile?.address?.street || "",
  city: profile?.address?.city || "",
  // ... etc
},
phone_number: profile?.phone_number || "",
```

## Expected Behavior

- **Guest Users**: Start at email verification step
- **Logged Users Without Profile**: Start at basic details step
- **Users with Address**: Skip to contact info step
- **Users with Phone**: Skip to requirements step

The error should now be resolved and the step advancement should work smoothly!
