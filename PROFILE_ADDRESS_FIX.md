# Profile Address Issue Fix

## Problem
The `profile.address` is returning null even when address data exists in the database.

## Root Causes Identified & Fixed

### 1. **Inconsistent Database Query Structure**
- ❌ **Issue**: Different queries used different address relationship structures
- ✅ **Fix**: Standardized all queries to use `address:addresses (*)`

### 2. **UserContext Query Inconsistency**
- ❌ **Issue**: `refreshUserData()` and `onAuthStateChange()` used different query methods
- ✅ **Fix**: Both now use the same `getUserProfile()` API function

### 3. **Profile Update Response Missing Address**
- ❌ **Issue**: `updateProfile()` didn't return address data in response
- ✅ **Fix**: Added address join to update response query

## Files Modified

### 1. `lib/supabaseAPI.js`
- **getUserProfile()**: Changed `addresses (*)` to `address:addresses (*)`
- **updateProfile()**: Added address join to response query

### 2. `contexts/UserContext.jsx`
- **refreshUserData()**: Already using correct API function
- **onAuthStateChange()**: Now uses `getUserProfile()` instead of direct query
- **Added debugging**: Console logs to track address data loading

### 3. `debug_address_relationship.sql` (NEW)
- SQL queries to debug address relationships in database
- Check user-address connections and data integrity

## Database Relationship

The correct relationship structure is:
```sql
users.address_id → addresses.id (one-to-one)
```

Query structure should be:
```sql
SELECT *, address:addresses (*) FROM users WHERE email = ?
```

This returns:
```javascript
{
  id: "user-id",
  email: "user@example.com",
  name: "User Name",
  address_id: "address-id",
  address: {  // Single object, not array
    id: "address-id",
    street: "123 Main St",
    city: "City",
    state: "State",
    // ... other address fields
  }
}
```

## Testing the Fix

### 1. **Check Browser Console**
After the fix, you should see console logs:
```
Profile loaded: {id: "...", email: "...", address: {...}}
Address data: {id: "...", street: "...", city: "..."}
```

### 2. **Test Profile Page**
1. Go to `/profile`
2. Check if address fields are populated
3. Try updating address information
4. Verify changes persist after refresh

### 3. **Test Request Tutor Page**
1. Go to `/request-tutor`
2. Check if address fields auto-populate from profile
3. Verify address data is available in form defaults

### 4. **Database Verification**
Run the queries in `debug_address_relationship.sql` to check:
- User-address relationships
- Address data integrity
- Missing connections

## Common Issues & Solutions

### 1. **Still Getting null address**
```sql
-- Check if user has address_id set
SELECT email, address_id FROM users WHERE email = 'your-email@example.com';

-- If address_id is null, create an address first
INSERT INTO addresses (street, city, state, country) 
VALUES ('Your Street', 'Your City', 'Your State', 'Your Country')
RETURNING id;

-- Then update user with address_id
UPDATE users SET address_id = 'new-address-id' WHERE email = 'your-email@example.com';
```

### 2. **Address not updating**
- Clear browser cache and refresh
- Check browser console for error messages
- Verify RLS policies allow address updates

### 3. **Profile not refreshing**
- Sign out and sign in again
- Check if `refreshUserData()` is being called
- Verify API responses in network tab

## Data Structure Expected

The profile object should now have this structure:
```javascript
profile = {
  id: "uuid",
  email: "user@example.com",
  name: "User Name",
  role: "student",
  address_id: "address-uuid",
  address: {
    id: "address-uuid",
    street: "123 Main St",
    city: "City Name",
    state: "State Name",
    zip: "12345",
    country: "Country",
    // ... other address fields
  },
  // ... other user fields
}
```

## Verification Steps

1. **Open browser console**
2. **Sign in to your account**
3. **Look for console logs** showing profile and address data
4. **Go to profile page** and check if address fields are populated
5. **Test address updates** to ensure they persist

The address data should now be properly loaded and accessible as `profile.address`!
