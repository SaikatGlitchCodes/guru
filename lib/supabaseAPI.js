/**
 * Supabase API service for the mentoring platform
 * This file contains all the database queries and operations
 */

import { supabase } from './supabaseClient'

// ===== TUTOR QUERIES =====

/**
 * Get top featured tutors by user role
 * Updated to use proper tutors table instead of users table
 */
export async function getTopTutorsByRole(limit = 10) {
  try {
    console.log('Fetching top tutors from tutors table...')
    
    const { data, error } = await supabase
      .from('tutors')
      .select(`
        id,
        user_id,
        hourly_rate,
        experience_years,
        verified,
        total_sessions,
        success_rate,
        users!inner (
          id,
          name,
          email,
          avatar_url,
          bio,
          rating,
          total_reviews,
          status,
          addresses (
            city,
            state,
            country,
            formatted
          )
        ),
        tutor_subjects (
          subjects (
            name,
            category
          )
        )
      `)
      .eq('verified', true)
      .eq('users.status', 'active')
      .not('users.rating', 'is', null)
      .order('total_sessions', { ascending: false })
      .order('experience_years', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching top tutors:', error)
      throw error
    }

    // Transform the data to match the expected format
    const transformedData = data?.map(tutor => ({
      id: tutor.id,
      user_id: tutor.user_id,
      name: tutor.users.name,
      email: tutor.users.email,
      avatar: tutor.users.avatar_url || "/placeholder.svg?height=80&width=80",
      subject: tutor.tutor_subjects?.[0]?.subjects?.name || "General Tutoring",
      subjects: tutor.tutor_subjects?.map(ts => ts.subjects?.name) || ["General Tutoring"],
      rating: tutor.users.rating || 4.5,
      reviews: tutor.users.total_reviews || 0,
      experience: `${tutor.experience_years || 0}+ years`,
      location: tutor.users.addresses?.city ? 
        `${tutor.users.addresses.city}, ${tutor.users.addresses.state}` : 
        "Remote",
      hourlyRate: tutor.hourly_rate || 50,
      badges: [
        "Verified Tutor",
        tutor.users.rating >= 4.5 ? "Top Rated" : "Quality Tutor",
        tutor.total_sessions > 100 ? "Experienced" : "Reliable"
      ],
      totalSessions: tutor.total_sessions || Math.floor((tutor.users.total_reviews || 0) * 1.5),
      responseTime: "Within 24 hours",
      specialization: tutor.users.bio ? 
        tutor.users.bio.substring(0, 50) + "..." : 
        "Professional tutoring and academic support",
      bgColor: tutor.id.slice(-1) % 2 === 0 ? 
        "bg-gradient-to-br from-yellow-400 to-yellow-500" : 
        "bg-gradient-to-br from-blue-400 to-blue-500",
      feedbackRate: `${Math.floor(85 + (tutor.success_rate || 0) * 15)}% Positive Feedback`,
      country: tutor.users.addresses?.country || "Global",
      verified: tutor.verified,
      experienceYears: tutor.experience_years || 0
    })) || []

    // Client-side sorting by rating and reviews for best quality tutors first
    transformedData.sort((a, b) => {
      // First sort by rating (higher is better)
      if (a.rating !== b.rating) {
        return b.rating - a.rating
      }
      // Then by number of reviews (more reviews is better)
      return b.reviews - a.reviews
    })

    console.log('Successfully fetched', transformedData.length, 'top tutors')
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Error fetching top tutors by role:', error)
    return { data: null, error }
  }
}

/**
 * Get all tutors with their subjects and location for the find-tutors page
 * Updated to use proper tutors table instead of users table
 */
export async function getAllTutors() {
  try {
    console.log('Fetching tutors from tutors table...')
    
    const { data: tutorData, error: tutorError } = await supabase
      .from('tutors')
      .select(`
        id,
        user_id,
        hourly_rate,
        experience_years,
        education,
        languages,
        specializations,
        response_time,
        availability_status,
        verified,
        background_check,
        preferred_meeting_types,
        travel_radius_km,
        instant_booking,
        total_sessions,
        success_rate,
        response_rate,
        users!inner (
          id,
          name,
          email,
          avatar_url,
          rating,
          total_reviews,
          bio,
          status,
          address_id,
          addresses (
            city,
            state,
            country,
            formatted
          )
        ),
        tutor_subjects (
          id,
          proficiency_level,
          years_experience,
          subjects (
            id,
            name,
            category
          )
        )
      `)
      .eq('verified', true)
      .eq('users.status', 'active')
      .order('total_sessions', { ascending: false })

    if (tutorError) {
      console.error('Error fetching from tutors table:', tutorError)
      throw tutorError
    }

    // Transform the data to match expected format
    const transformedData = tutorData?.map(tutor => ({
      id: tutor.id,
      user_id: tutor.user_id,
      name: tutor.users.name,
      email: tutor.users.email,
      avatar_url: tutor.users.avatar_url || "/placeholder.svg?height=80&width=80",
      rating: tutor.users.rating || 4.5,
      total_reviews: tutor.users.total_reviews || 0,
      hourly_rate: tutor.hourly_rate || 50,
      experience_years: tutor.experience_years || 0,
      education: tutor.education,
      languages: tutor.languages || [],
      specializations: tutor.specializations || [],
      response_time: tutor.response_time || '< 24 hours',
      availability_status: tutor.availability_status || 'available',
      verified: tutor.verified,
      background_check: tutor.background_check || false,
      preferred_meeting_types: tutor.preferred_meeting_types || [],
      travel_radius_km: tutor.travel_radius_km || 10,
      instant_booking: tutor.instant_booking || false,
      total_sessions: tutor.total_sessions || 0,
      success_rate: tutor.success_rate || 0,
      response_rate: tutor.response_rate || 0,
      bio: tutor.users.bio,
      city: tutor.users.addresses?.city,
      state: tutor.users.addresses?.state,
      country: tutor.users.addresses?.country,
      location: tutor.users.addresses ? 
        `${tutor.users.addresses.city || ''}, ${tutor.users.addresses.state || ''}`.replace(/^,\s*|,\s*$/, '') : 
        'Location not specified',
      subjects: tutor.tutor_subjects?.map(ts => ({
        id: ts.subjects.id,
        name: ts.subjects.name,
        category: ts.subjects.category,
        proficiency_level: ts.proficiency_level,
        years_experience: ts.years_experience
      })) || [],
      // Legacy compatibility fields
      badges: ["Verified Tutor", tutor.users.rating >= 4.5 ? "Top Rated" : "Quality Tutor"],
      feedbackRate: `${Math.floor(85 + (tutor.success_rate || 0) * 15)}% Positive Feedback`,
      bgColor: tutor.id.slice(-1) % 2 === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" : "bg-gradient-to-br from-blue-400 to-blue-500"
    })) || []

    console.log('Successfully fetched', transformedData.length, 'tutors')
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return { data: null, error }
  }
}

/**
 * Search tutors with filters and pagination
 * Updated to properly use tutors table with comprehensive filtering
 */
export async function searchTutors({
  searchQuery = '',
  subjects = [],
  locations = [],
  minPrice = 0,
  maxPrice = 1000,
  minRating = 0,
  availabilityStatus = '',
  sortBy = 'rating',
  page = 1,
  limit = 8
}) {
  try {
    console.log('Searching tutors with filters:', {
      searchQuery, subjects, locations, minPrice, maxPrice, minRating, availabilityStatus, sortBy, page, limit
    })

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the main query with proper joins
    let query = supabase
      .from('tutors')
      .select(`
        id,
        user_id,
        hourly_rate,
        experience_years,
        education,
        languages,
        specializations,
        response_time,
        availability_status,
        verified,
        background_check,
        preferred_meeting_types,
        travel_radius_km,
        instant_booking,
        total_sessions,
        success_rate,
        response_rate,
        users!inner (
          id,
          name,
          email,
          avatar_url,
          rating,
          total_reviews,
          bio,
          status,
          address_id,
          addresses (
            city,
            state,
            country,
            formatted
          )
        ),
        tutor_subjects (
          id,
          proficiency_level,
          years_experience,
          subjects (
            id,
            name,
            category
          )
        )
      `, { count: 'exact' })
      .eq('verified', true)
      .eq('users.status', 'active');

    // Apply filters
    if (minPrice > 0 || maxPrice < 1000) {
      query = query.gte('hourly_rate', minPrice).lte('hourly_rate', maxPrice);
    }

    if (minRating > 0) {
      query = query.gte('users.rating', minRating);
    }

    if (availabilityStatus && availabilityStatus !== 'all' && availabilityStatus !== '') {
      query = query.eq('availability_status', availabilityStatus);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('hourly_rate', { ascending: true });
        break;
      case 'price-high':
        query = query.order('hourly_rate', { ascending: false });
        break;
      case 'experience':
        query = query.order('experience_years', { ascending: false });
        break;
      case 'reviews':
        query = query.order('users(total_reviews)', { ascending: false });
        break;
      case 'rating':
      default:
        query = query.order('users(rating)', { ascending: false });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: tutorData, error, count: totalCount } = await query;

    if (error) {
      console.error('Database query error:', error)
      throw error;
    }

    console.log('Raw tutor data fetched:', tutorData?.length, 'records, total count:', totalCount)

    // Transform the data
    let transformedData = tutorData?.map(tutor => ({
      id: tutor.id,
      user_id: tutor.user_id,
      name: tutor.users.name,
      email: tutor.users.email,
      avatar_url: tutor.users.avatar_url || "/placeholder.svg?height=80&width=80",
      rating: tutor.users.rating || 0,
      total_reviews: tutor.users.total_reviews || 0,
      hourly_rate: tutor.hourly_rate || 0,
      experience_years: tutor.experience_years || 0,
      education: tutor.education,
      languages: tutor.languages || [],
      specializations: tutor.specializations || [],
      response_time: tutor.response_time || '< 24 hours',
      availability_status: tutor.availability_status || 'available',
      verified: tutor.verified,
      background_check: tutor.background_check || false,
      preferred_meeting_types: tutor.preferred_meeting_types || [],
      travel_radius_km: tutor.travel_radius_km || 10,
      instant_booking: tutor.instant_booking || false,
      total_sessions: tutor.total_sessions || 0,
      success_rate: tutor.success_rate || 0,
      response_rate: tutor.response_rate || 0,
      bio: tutor.users.bio,
      city: tutor.users.addresses?.city,
      state: tutor.users.addresses?.state,
      country: tutor.users.addresses?.country,
      location: tutor.users.addresses ? 
        `${tutor.users.addresses.city || ''}, ${tutor.users.addresses.state || ''}`.replace(/^,\s*|,\s*$/, '') : 
        'Location not specified',
      subjects: tutor.tutor_subjects?.map(ts => ({
        id: ts.subjects?.id,
        name: ts.subjects?.name,
        category: ts.subjects?.category,
        proficiency_level: ts.proficiency_level,
        years_experience: ts.years_experience
      })).filter(s => s.name) || [],
      // Extract subject names for filtering
      subjectNames: tutor.tutor_subjects?.map(ts => ts.subjects?.name).filter(Boolean) || []
    })) || [];

    console.log('Transformed data before client filtering:', transformedData.length, 'tutors')

    // Apply client-side filters for complex searches
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      transformedData = transformedData.filter(tutor => 
        tutor.name.toLowerCase().includes(query) ||
        tutor.bio?.toLowerCase().includes(query) ||
        tutor.education?.toLowerCase().includes(query) ||
        tutor.subjectNames.some(subject => subject.toLowerCase().includes(query)) ||
        tutor.specializations?.some(spec => spec.toLowerCase().includes(query))
      );
    }

    if (subjects.length > 0 && !subjects.includes('all')) {
      transformedData = transformedData.filter(tutor =>
        tutor.subjectNames.some(subject => 
          subjects.some(filterSubject => 
            subject.toLowerCase().includes(filterSubject.toLowerCase())
          )
        )
      );
    }

    if (locations.length > 0 && !locations.includes('all')) {
      transformedData = transformedData.filter(tutor =>
        locations.some(location => 
          tutor.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    console.log('Final filtered data:', transformedData.length, 'tutors')

    // For pagination, we need to recalculate totals after client-side filtering
    const filteredTotalCount = transformedData.length;

    return {
      data: transformedData,
      totalCount: filteredTotalCount,
      totalPages: Math.ceil(filteredTotalCount / limit),
      currentPage: page,
      hasMore: offset + limit < filteredTotalCount,
      error: null
    };

  } catch (error) {
    console.error('Error searching tutors:', error);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasMore: false,
      error
    };
  }
}

/**
 * Get unique subjects and locations for filters
 * Updated to use tutors table instead of users table
 */
export async function getTutorFiltersData() {
  try {
    console.log('Fetching filter data from tutors table...')
    
    // Get subjects from tutor_subjects table (subjects that tutors actually teach)
    const { data: subjectsData, error: subjectsError } = await supabase
      .from('tutor_subjects')
      .select(`
        subjects (
          id,
          name,
          category
        )
      `)
      .not('subjects', 'is', null)
      .order('subjects(name)')

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError)
      throw subjectsError
    }

    // Get locations from addresses of active verified tutors
    const { data: locationsData, error: locationsError } = await supabase
      .from('tutors')
      .select(`
        users!inner (
          addresses (
            city,
            state,
            country
          )
        )
      `)
      .eq('verified', true)
      .eq('users.status', 'active')
      .not('users.addresses', 'is', null)

    if (locationsError) {
      console.error('Error fetching locations:', locationsError)
      throw locationsError
    }

    // Process subjects - get unique subject names
    const uniqueSubjects = [...new Set(
      subjectsData
        ?.map(ts => ts.subjects?.name)
        ?.filter(Boolean)
    )].sort()

    // Process locations - create formatted location strings
    const uniqueLocations = [...new Set(
      locationsData
        ?.map(tutor => {
          const addr = tutor.users?.addresses
          if (!addr) return null
          return `${addr.city || ''}, ${addr.state || ''}`.replace(/^,\s*|,\s*$/, '')
        })
        ?.filter(Boolean)
        ?.filter(location => location.trim() !== ',') // Filter out empty locations
    )].sort()

    console.log('Filter data processed:', {
      subjects: uniqueSubjects.length,
      locations: uniqueLocations.length
    })

    return {
      subjects: uniqueSubjects,
      locations: uniqueLocations,
      error: null
    }
  } catch (error) {
    console.error('Error fetching tutor filter data:', error)
    return {
      subjects: [],
      locations: [],
      error
    }
  }
}

/**
 * Legacy function - kept for backward compatibility
 */
export async function getAllTutorsLegacy() {
  const result = await searchTutors({ limit: 100 });
  return { data: result.data, error: result.error };
}

/**
 * Original searchTutors function - updated
 */
export async function searchTutorsOld({
  searchQuery = '',
  subjects = [],
  locations = [],
  minPrice = 0,
  maxPrice = 1000,
  minRating = 0,
  availabilityStatus = 'available',
  sortBy = 'rating'
}) {
  try {
    let query = supabase
      .from('tutor_search_view')
      .select('*')
      .eq('verified', true)
      .eq('availability_status', availabilityStatus)
      .gte('hourly_rate', minPrice)
      .lte('hourly_rate', maxPrice)
      .gte('rating', minRating)

    // Search query filter
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,subjects.cs.{${searchQuery}}`)
    }

    // Subject filter
    if (subjects.length > 0) {
      query = query.overlaps('subjects', subjects)
    }

    // Location filter
    if (locations.length > 0) {
      query = query.in('location', locations)
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'price-low':
        query = query.order('hourly_rate', { ascending: true })
        break
      case 'price-high':
        query = query.order('hourly_rate', { ascending: false })
        break
      case 'experience':
        query = query.order('experience_years', { ascending: false })
        break
      case 'reviews':
        query = query.order('total_reviews', { ascending: false })
        break
      default:
        query = query.order('rating', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error searching tutors:', error)
    return { data: null, error }
  }
}

/**
 * Get tutor profile by ID
 */
export async function getTutorProfile(tutorId) {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select(`
        *,
        user:users(*,
          address:addresses(*)
        ),
        tutor_subjects(
          *,
          subject:subjects(*)
        ),
        tutor_availability(*)
      `)
      .eq('id', tutorId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching tutor profile:', error)
    return { data: null, error }
  }
}

/**
 * Get tutor availability for booking
 */
export async function getTutorAvailability(tutorId, startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('tutor_availability')
      .select('*')
      .eq('tutor_id', tutorId)
      .eq('is_available', true)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching tutor availability:', error)
    return { data: null, error }
  }
}

// ===== USER QUERIES =====

/**
 * Get or create user profile
 */
export async function getOrCreateUser(authUser) {
  try {
    // First, try to get existing user
    let { data: user, error } = await supabase
      .from('users')
      .select('*, address:addresses(*)')
      .eq('email', authUser.email)
      .single()

    if (error && error.code === 'PGRST116') {
      // User doesn't exist, create new one with student role by default
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          phone_number: authUser.user_metadata?.phone || authUser.phone || null,
          phone_verified: false, // Phone will need to be verified separately
          role: 'student', // Always create new users as students by default
          email_verified: authUser.email_confirmed_at ? true : false
        })
        .select()
        .single()

      if (createError) throw createError
      user = newUser
    } else if (error) {
      throw error
    }

    return { data: user, error: null }
  } catch (error) {
    console.error('Error getting/creating user:', error)
    return { data: null, error }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error }
  }
}

// ===== REQUEST QUERIES =====

/**
 * Create a comprehensive tutor request with all related data
 */
export async function createRequest(requestData) {
  try {
    console.log('Creating request with data:', requestData)
    console.log('Subject data received:', requestData.subject)
    console.log('User email from request data:', requestData)
    
    // Validate email format
    if (!requestData.user_email || !requestData.user_email.includes('@')) {
      throw new Error('Invalid or missing email address')
    }
    
    // Get the currently authenticated user for fallback
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const emailToUse = requestData.user_email || authUser?.email
    
    if (!emailToUse) {
      throw new Error('No email address available from request data or authenticated user')
    }
    
    console.log('Using email for user lookup:', emailToUse)
    
    // First, get the user by email, or create if they don't exist
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, address_id')
      .eq('email', emailToUse)
      .single()

    // If user doesn't exist, create them
    if (userError && userError.code === 'PGRST116') {
      console.log('User not found, creating new user:', emailToUse)
      
      // Create new user with student role by default
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: emailToUse,
          name: requestData.name || authUser?.user_metadata?.name || emailToUse.split('@')[0],
          phone_number: requestData.phone_number || requestData.phone || null,
          phone_verified: false,
          role: 'student',
          status: 'active',
          coin_balance: 0,
          rating: 0,
          total_reviews: 0,
          profile_completion_percentage: 0,
          email_verified: authUser?.email_confirmed_at ? true : false
        })
        .select('id, address_id')
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        throw new Error(`Failed to create user: ${createError.message}`)
      }
      
      userData = newUser
      console.log('New user created:', userData)
    } else if (userError) {
      console.error('User lookup error:', userError)
      throw new Error(`User lookup failed: ${userError?.message || 'Unknown error'}`)
    }

    if (!userData) {
      throw new Error('Failed to get or create user')
    }

    console.log('Using user data:', userData)

    let addressId = userData.address_id

    // Create or update address if provided (check both nested object and individual fields)
    const addressFromObject = requestData.address && Object.keys(requestData.address).length > 0 ? requestData.address : null
    const addressFromFields = requestData.street || requestData.city || requestData.state || requestData.zip || requestData.country
    
    if (addressFromObject || addressFromFields) {
      const addressData = {
        street: addressFromObject?.street || requestData.street || '',
        city: addressFromObject?.city || requestData.city || '',
        state: addressFromObject?.state || requestData.state || '',
        zip: addressFromObject?.zip || requestData.zip || '',
        country: addressFromObject?.country || requestData.country || '',
        country_code: addressFromObject?.country_code || requestData.country_code || '',
        address_line_1: addressFromObject?.addressline_1 || addressFromObject?.address_line_1 || requestData.address_line_1 || '',
        address_line_2: addressFromObject?.addressline_2 || addressFromObject?.address_line_2 || requestData.address_line_2 || '',
        lat: addressFromObject?.lat || requestData.address_lat || 0,
        lon: addressFromObject?.lon || requestData.address_lon || 0,
        formatted: addressFromObject?.formatted || requestData.address || ''
      }

      if (addressId) {
        // Update existing address
        const { error: addressError } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', addressId)

        if (addressError) throw addressError
      } else {
        // Create new address
        const { data: newAddress, error: addressError } = await supabase
          .from('addresses')
          .insert([addressData])
          .select()
          .single()

        if (addressError) throw addressError
        addressId = newAddress.id

        // Update user with new address_id
        await supabase
          .from('users')
          .update({ address_id: addressId })
          .eq('id', userData.id)
      }
    }

    // Prepare the request data for insertion
    const requestInsertData = {
      user_id: userData.id,
      address_id: addressId,
      title: `${requestData.type} Request for ${requestData.subject?.map(s => s.value || s).join(', ') || 'Multiple Subjects'}`,
      description: requestData.description,
      type: requestData.type,
      level: requestData.level,
      status: 'open',
      price_amount: parseFloat(requestData.price_amount) || 0,
      price_option: requestData.price_option,
      price_currency: requestData.price_currency || 'USD',
      price_currency_symbol: requestData.price_currency_symbol || '$',
      gender_preference: requestData.gender_preference || 'None',
      tutors_want: requestData.tutors_want || 'Only one',
      i_need_someone: requestData.i_need_someone || 'part time',
      language: JSON.stringify(requestData.language || []),
      get_tutors_from: requestData.get_tutors_from || '',
      online_meeting: requestData.meeting_options?.Online?.state || false,
      offline_meeting: requestData.meeting_options?.Offline?.state || false,
      travel_meeting: requestData.meeting_options?.Travel?.state || false,
      urgency: 'flexible'
    }

    // Insert the request
    const { data: newRequest, error: requestError } = await supabase
      .from('requests')
      .insert([requestInsertData])
      .select()
      .single()

    if (requestError) throw requestError

    // Handle subjects - create request_subjects relationships
    if (requestData.subject && Array.isArray(requestData.subject) && requestData.subject.length > 0) {
      console.log('Processing subjects:', requestData.subject)
      const subjectPromises = requestData.subject.map(async (subject) => {
        console.log('Processing individual subject:', subject, 'Type:', typeof subject);

        // Create request_subjects relationship
        return supabase
          .from('request_subjects')
          .insert([{
            request_id: newRequest.id,
            subject_id: subject.id
          }])
      })

      await Promise.all(subjectPromises)
    }

    // Return the complete request with related data
    const { data: completeRequest, error: fetchError } = await supabase
      .from('requests')
      .select(`
        *,
        user:users(name, email),
        address:addresses(*),
        subjects:request_subjects(subject:subjects(*))
      `)
      .eq('id', newRequest.id)
      .single()

    if (fetchError) throw fetchError

    console.log('Request created successfully:', completeRequest)
    return { data: completeRequest, error: null }
  } catch (error) {
    console.error('Error creating request:', error)
    return { data: null, error: error.message || error }
  }
}

/**
 * Create a new tutor request (legacy function - consider using createRequest instead)
 */
export async function createTutorRequest(requestData) {
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating request:', error)
    return { data: null, error }
  }
}

/**
 * Get requests for tutor jobs page with enhanced filtering
 */
export async function getOpenRequests({
  searchQuery = '',
  subjects = [],
  locations = [],
  minPrice = 0,
  maxPrice = 10000,
  meetingTypes = [],
  urgencyLevels = [],
  requestTypes = [],
  levels = [],
  sortBy = 'newest',
  page = 1,
  limit = 12
}) {
  try {
    // First, get the total count without pagination
    let countQuery = supabase
      .from('requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open')
      .gte('price_amount', minPrice)
      .lte('price_amount', maxPrice)

    // Apply the same filters to count query
    if (searchQuery) {
      countQuery = countQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,level.ilike.%${searchQuery}%`)
    }

    if (locations.length > 0) {
      const locationConditions = locations.map(loc => 
        `address.city.ilike.%${loc}%,address.state.ilike.%${loc}%`
      ).join(',')
      countQuery = countQuery.or(locationConditions)
    }

    if (meetingTypes.length > 0) {
      const conditions = []
      if (meetingTypes.includes('online')) conditions.push('online_meeting.eq.true')
      if (meetingTypes.includes('offline')) conditions.push('offline_meeting.eq.true')
      if (meetingTypes.includes('travel')) conditions.push('travel_meeting.eq.true')
      if (conditions.length > 0) {
        countQuery = countQuery.or(conditions.join(','))
      }
    }

    if (urgencyLevels.length > 0) {
      countQuery = countQuery.in('urgency', urgencyLevels)
    }

    if (requestTypes.length > 0) {
      countQuery = countQuery.in('type', requestTypes)
    }

    if (levels.length > 0) {
      countQuery = countQuery.in('level', levels)
    }

    // Get total count
    const { count: totalCount, error: countError } = await countQuery

    if (countError) throw countError

    console.log('Total count from database:', totalCount)

    // Now get the actual data with pagination
    let query = supabase
      .from('requests')
      .select(`
        *,
        user:users(name),
        address:addresses(*),
        subjects:request_subjects(subject:subjects(*))
      `)
      .eq('status', 'open')
      .gte('price_amount', minPrice)
      .lte('price_amount', maxPrice)

    // Search query filter - enhanced to include more fields
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,level.ilike.%${searchQuery}%`)
    }

    // Subject filter - using subject names
    if (subjects.length > 0) {
      // This requires a more complex query to filter by subject names
      // We'll handle this in the client-side filtering for now due to the complexity of joins
    }

    // Location filter
    if (locations.length > 0) {
      // Filter by city or state
      const locationConditions = locations.map(loc => 
        `address.city.ilike.%${loc}%,address.state.ilike.%${loc}%`
      ).join(',')
      query = query.or(locationConditions)
    }

    // Meeting types filter
    if (meetingTypes.length > 0) {
      const conditions = []
      if (meetingTypes.includes('online')) conditions.push('online_meeting.eq.true')
      if (meetingTypes.includes('offline')) conditions.push('offline_meeting.eq.true')
      if (meetingTypes.includes('travel')) conditions.push('travel_meeting.eq.true')
      if (conditions.length > 0) {
        query = query.or(conditions.join(','))
      }
    }

    // Urgency filter
    if (urgencyLevels.length > 0) {
      query = query.in('urgency', urgencyLevels)
    }

    // Request type filter
    if (requestTypes.length > 0) {
      query = query.in('type', requestTypes)
    }

    // Level filter
    if (levels.length > 0) {
      query = query.in('level', levels)
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'price-high':
        query = query.order('price_amount', { ascending: false })
        break
      case 'price-low':
        query = query.order('price_amount', { ascending: true })
        break
      case 'urgent':
        query = query.order('urgency', { ascending: false }).order('created_at', { ascending: false })
        break
      case 'popular':
        query = query.order('view_count', { ascending: false, nullsLast: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error
    
    // Transform the data to match the expected format
    let transformedData = data?.map(request => ({
      ...request,
      student_name: request.user?.name || 'Student',
      subjects: request.subjects?.map(s => ({ name: s.subject.name })) || [],
      language: request.language ? JSON.parse(request.language) : [],
    })) || []
    
    // Client-side subject filtering (due to complex join requirements)
    if (subjects.length > 0) {
      transformedData = transformedData.filter(request =>
        request.subjects.some(subject =>
          subjects.some(filterSubject =>
            subject.name.toLowerCase().includes(filterSubject.toLowerCase())
          )
        )
      )
    }
    
    console.log('Transformed requests data:', transformedData)
    console.log('Returning totalItems:', totalCount || transformedData.length)
    
    return { data: transformedData, error: null, totalItems: totalCount || transformedData.length }
  } catch (error) {
    console.error('Error fetching requests:', error)
    return { data: null, error, total: 0 }
  }
}

/**
 * Get all unique filter options from requests
 */
export async function getRequestFilterOptions() {
  try {
    // Get subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('name')
      .order('name')

    if (subjectsError) throw subjectsError

    // Get locations from addresses used in requests
    const { data: locations, error: locationsError } = await supabase
      .from('requests')
      .select('address:addresses(city, state)')
      .eq('status', 'open')

    if (locationsError) throw locationsError

    // Get unique request types, levels, and urgency levels
    const { data: requestTypes, error: typesError } = await supabase
      .from('requests')
      .select('type')
      .eq('status', 'open')
      .not('type', 'is', null)

    const { data: levels, error: levelsError } = await supabase
      .from('requests')
      .select('level')
      .eq('status', 'open')
      .not('level', 'is', null)

    const { data: urgencyData, error: urgencyError } = await supabase
      .from('requests')
      .select('urgency')
      .eq('status', 'open')
      .not('urgency', 'is', null)

    // Process unique values
    const uniqueLocations = [...new Set(
      locations
        ?.filter(req => req.address)
        ?.map(req => `${req.address.city}, ${req.address.state}`)
        ?.filter(Boolean)
    )].sort()

    const uniqueRequestTypes = [...new Set(
      requestTypes?.map(r => r.type)?.filter(Boolean)
    )].sort()

    const uniqueLevels = [...new Set(
      levels?.map(r => r.level)?.filter(Boolean)
    )].sort()

    const uniqueUrgency = [...new Set(
      urgencyData?.map(r => r.urgency)?.filter(Boolean)
    )].sort()

    return {
      data: {
        subjects: subjects?.map(s => s.name) || [],
        locations: uniqueLocations,
        requestTypes: uniqueRequestTypes,
        levels: uniqueLevels,
        urgencyLevels: uniqueUrgency,
        meetingTypes: ['online', 'offline', 'travel'],
        sortOptions: [
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'price-high', label: 'Highest Price' },
          { value: 'price-low', label: 'Lowest Price' },
          { value: 'urgent', label: 'Most Urgent' },
          { value: 'popular', label: 'Most Popular' }
        ]
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return { data: null, error }
  }
}

/**
 * Get user's requests by user ID or email
 */
export async function getUserRequests(userIdentifier) {
  try {
    let userId = userIdentifier

    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        address:addresses(*),
        subjects:request_subjects(subject:subjects(*))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Get contact activities for each request to show tutor interactions
    const requestsWithContacts = await Promise.all(
      (data || []).map(async (request) => {
        try {
          const { data: contacts, error: contactError } = await supabase
            .from('contact_activities')
            .select('*')
            .eq('request_id', request.id)
            .order('contacted_at', { ascending: false })

          if (contactError) {
            console.error('Error fetching contact activities:', contactError)
            return {
              ...request,
              view_count: request.view_count || 0,
              contact_activities: [],
              contacted_count: 0
            }
          }

          // Get tutor information for each contact
          const contactsWithTutors = await Promise.all(
            (contacts || []).map(async (contact) => {
              try {
                const { data: tutorData, error: tutorError } = await supabase
                  .from('users')
                  .select('name, avatar_url, email')
                  .eq('email', contact.tutor_email)
                  .single()

                return {
                  ...contact,
                  tutor: tutorData || { 
                    name: 'Unknown Tutor', 
                    avatar_url: null, 
                    email: contact.tutor_email 
                  }
                }
              } catch (err) {
                console.error('Error fetching tutor data:', err)
                return {
                  ...contact,
                  tutor: { 
                    name: 'Unknown Tutor', 
                    avatar_url: null, 
                    email: contact.tutor_email 
                  }
                }
              }
            })
          )

          return {
            ...request,
            view_count: request.view_count || 0,
            contact_activities: contactsWithTutors,
            contacted_count: contactsWithTutors.length
          }
        } catch (err) {
          console.error('Error processing request contacts:', err)
          return {
            ...request,
            view_count: request.view_count || 0,
            contact_activities: [],
            contacted_count: 0
          }
        }
      })
    )

    return { data: requestsWithContacts, error: null }
  } catch (error) {
    console.error('Error fetching user requests:', error)
    return { data: null, error }
  }
}

/**
 * Update request status
 */
export async function updateRequestStatus(requestId, status, userId) {
  try {

    if (!userId) {
      throw new Error('You are not authorized to update this request')
    }

    // Update the request status
    const { data, error } = await supabase
      .from('requests')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()
    console.log('Updating request status:',data, requestId, 'to', status)
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating request status:', error)
    return { data: null, error }
  }
}

/**
 * Get a single request by ID with all related data
 * 
 * SECURITY IMPLEMENTATION:
 * - Uses two-tier data access: public info vs. protected contact details
 * - Contact information (email, phone) only exposed after payment verification
 * - Database-level filtering prevents sensitive data from reaching the client
 * - Network tab inspection cannot reveal protected contact details
 * - Payment status checked via contact_activities table
 * 
 * @param {string} requestId - The request ID to fetch
 * @param {string|null} tutorEmail - Tutor's email for payment verification
 * @returns {Object} Request data with security-appropriate fields
 */
export async function getRequestById(requestId, tutorEmail = null) {
  try {
    console.log('Fetching request by ID:', requestId, 'Tutor email:', tutorEmail)
    // Check if tutor has already paid for this request first
    let hasAlreadyPaid = false
    if (tutorEmail) {
      const { data: contactActivity, error: contactError } = await supabase
        .from('contact_activities')
        .select('*')
        .eq('tutor_email', tutorEmail)
        .eq('request_id', requestId)
        // .single()

      console.log('Contact activity for tutor:', contactActivity, 'Error:', contactError)
      if (contactActivity?.length && !contactError) {
        hasAlreadyPaid = true
        console.log('Tutor has already paid for this request:', contactActivity)
      }
    }

    // Conditionally select user data based on payment status
    const userSelectFields = hasAlreadyPaid 
      ? 'name, email, avatar_url, phone_number, phone_verified'
      : 'name, avatar_url'

    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        user:users(${userSelectFields}),
        address:addresses(*),
        subjects:request_subjects(subject:subjects(*))
      `)
      .eq('id', requestId)
      .single()

    if (error) throw error
    console.log('Fetched request data (protected):', { 
      requestId, 
      hasAlreadyPaid, 
      hasContactInfo: !!data.user?.email 
    })
    
    // Transform the data to match expected format with security considerations
    const transformedData = {
      ...data,
      student_name: data.user?.name || 'Student',
      // Only expose contact details if tutor has paid
      student_email: hasAlreadyPaid ? data.user?.email : 'Contact details available after payment',
      student_phone: hasAlreadyPaid ? (data.user?.phone_number || 'Phone not available') : 'Contact details available after payment',
      student_verified: hasAlreadyPaid ? (data.user?.phone_number ? true : false) : false,
      phone_verified: hasAlreadyPaid ? (data.user?.phone_verified || false) : false,
      // Public information (always available)
      subjects: data.subjects?.map(s => ({ name: s.subject.name })) || [],
      language: data.languages ? data.languages.map(lang => ({ label: lang })) : [],
      contacted_count: data.contacted_count || 0,
      student_contacted_count: data.student_contacted_count || 0,
      view_count: data.view_count || 0,
      level: data.level || 'Not specified',
      schedule: data.schedule || 'Flexible',
      gender_preference: data.gender_preference || 'None',
      urgency: data.urgency || 'flexible',
      hasAlreadyPaid,
      // Security flag to indicate if contact info is available
      contactInfoAvailable: hasAlreadyPaid
    }

    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Error fetching request by ID:', error)
    return { data: null, error }
  }
}

// ===== APPLICATION QUERIES =====

/**
 * Apply to a request as a tutor
 */
export async function applyToRequest(applicationData) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error applying to request:', error)
    return { data: null, error }
  }
}

/**
 * Get tutor's applications
 */
export async function getTutorApplications(tutorId) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        request:requests(
          *,
          user:users(name),
          address:addresses(*),
          subjects:request_subjects(subject:subjects(*))
        )
      `)
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching tutor applications:', error)
    return { data: null, error }
  }
}

// ===== SESSION QUERIES =====

/**
 * Book a session with a tutor
 */
export async function bookSession(sessionData) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert(sessionData)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error booking session:', error)
    return { data: null, error }
  }
}

/**
 * Get user's sessions
 */
export async function getUserSessions(userId, role = 'student') {
  try {
    const column = role === 'student' ? 'student_id' : 'tutor_id'
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        student:users!sessions_student_id_fkey(name, avatar_url),
        tutor:tutors(user:users(name, avatar_url)),
        subject:subjects(name)
      `)
      .eq(column, userId)
      .order('scheduled_start', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user sessions:', error)
    return { data: null, error }
  }
}

// ===== MESSAGE QUERIES =====

/**
 * Send a message
 */
export async function sendMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select(`
        *,
        sender:users!messages_sender_id_fkey(name, avatar_url),
        recipient:users!messages_recipient_id_fkey(name, avatar_url)
      `)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error sending message:', error)
    return { data: null, error }
  }
}

/**
 * Get conversations for a user
 */
export async function getUserConversations(userId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url),
        recipient:users!messages_recipient_id_fkey(id, name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group messages by conversation
    const conversations = {}
    data.forEach(message => {
      const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id
      const otherUser = message.sender_id === userId ? message.recipient : message.sender
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: otherUser,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      
      conversations[otherUserId].messages.push(message)
      
      if (!conversations[otherUserId].lastMessage || 
          new Date(message.created_at) > new Date(conversations[otherUserId].lastMessage.created_at)) {
        conversations[otherUserId].lastMessage = message
      }
      
      if (!message.read && message.recipient_id === userId) {
        conversations[otherUserId].unreadCount++
      }
    })

    // Sort messages within each conversation chronologically (oldest first)
    Object.values(conversations).forEach(conversation => {
      conversation.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    })

    // Sort conversations by last message time
    const sortedConversations = Object.values(conversations).sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0
      if (!a.lastMessage) return 1
      if (!b.lastMessage) return -1
      return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
    })

    return { data: sortedConversations, error: null }
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return { data: null, error }
  }
}

/**
 * Get messages for a specific conversation between two users
 */
export async function getConversationMessages(userId, otherUserId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar_url, email, phone_number),
        recipient:users!messages_recipient_id_fkey(id, name, avatar_url, email, phone_number)
      `)
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true }) // Chronological order for chat display

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching conversation messages:', error)
    return { data: null, error }
  }
}

// ===== NOTIFICATION QUERIES =====

/**
 * Get user notifications
 */
export async function getUserNotifications(userId, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { data: null, error }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { data: null, error }
  }
}

// ===== SUBJECT QUERIES =====

/**
 * Get all subjects
 */
export async function getAllSubjects() {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return { data: null, error }
  }
}

/**
 * Get user's subjects
 */
export async function getUserSubjects(userEmail) {
  try {
    // First get the user ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (userError || !userData) {
      return { data: [], error: null } // Return empty array if user not found
    }

    const { data, error } = await supabase
      .from('user_subjects')
      .select(`
        *,
        subject:subjects(*)
      `)
      .eq('user_id', userData.id)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user subjects:', error)
    return { data: null, error }
  }
}

/**
 * Add subject to user
 */
export async function addUserSubject(userEmail, subjectId) {
  try {
    // First get the user ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (userError || !userData) {
      throw new Error('User not found')
    }

    const { data, error } = await supabase
      .from('user_subjects')
      .insert([{
        user_id: userData.id,
        subject_id: subjectId
      }])
      .select(`
        *,
        subject:subjects(*)
      `)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error adding user subject:', error)
    return { data: null, error }
  }
}

/**
 * Remove subject from user
 */
export async function removeUserSubject(userEmail, subjectId) {
  try {
    // First get the user ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (userError || !userData) {
      throw new Error('User not found')
    }

    const { error } = await supabase
      .from('user_subjects')
      .delete()
      .eq('user_id', userData.id)
      .eq('subject_id', subjectId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error removing user subject:', error)
    return { error }
  }
}

// ===== USER PROFILE QUERIES =====

/**
 * Get user profile by email
 */
export async function getUserProfile(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        address:addresses (*)
      `)
      .eq('email', email)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error }
  }
}

/**
 * Create a new user profile
 */
export async function createProfile(profileData) {
  try {
    // First create the address if provided
    let addressId = null
    if (profileData.address && Object.keys(profileData.address).length > 0) {
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert([{
          street: profileData.address.street,
          city: profileData.address.city,
          state: profileData.address.state,
          zip: profileData.address.zip,
          country: profileData.address.country,
          country_code: profileData.address.country_code,
          address_line_1: profileData.address.addressline_1 || profileData.address.address_line_1,
          address_line_2: profileData.address.addressline_2 || profileData.address.address_line_2,
          lat: profileData.address.lat,
          lon: profileData.address.lon,
          formatted: profileData.address.formatted
        }])
        .select()
        .single()

      if (addressError) throw addressError
      addressId = addressData.id
    }

    // Create the user profile
    const userData = {
      email: profileData.email,
      name: profileData.name,
      role: profileData.role || 'student',
      phone_number: profileData.phone_number,
      gender: profileData.gender,
      bio: profileData.bio,
      years_of_experience: profileData.years_of_experience,
      hobbies: profileData.hobbies,
      status: profileData.status || 'active',
      coin_balance: profileData.coin_balance || 0,
      address_id: addressId
    }

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { data: null, error }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(profileData, email) {
  try {
    // First get the current user to check for existing address
    const { data: currentUser } = await supabase
      .from('users')
      .select('address_id')
      .eq('email', email)
      .single()

    let addressId = currentUser?.address_id

    // Handle address update/creation
    if (profileData.address && Object.keys(profileData.address).length > 0) {
      const addressData = {
        street: profileData.address.street,
        city: profileData.address.city,
        state: profileData.address.state,
        zip: profileData.address.zip,
        country: profileData.address.country,
        country_code: profileData.address.country_code,
        address_line_1: profileData.address.addressline_1 || profileData.address.address_line_1,
        address_line_2: profileData.address.addressline_2 || profileData.address.address_line_2,
        lat: profileData.address.lat,
        lon: profileData.address.lon,
        formatted: profileData.address.formatted
      }

      if (addressId) {
        // Update existing address
        const { error: addressError } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', addressId)

        if (addressError) throw addressError
      } else {
        // Create new address
        const { data: newAddress, error: addressError } = await supabase
          .from('addresses')
          .insert([addressData])
          .select()
          .single()

        if (addressError) throw addressError
        addressId = newAddress.id
      }
    }

    // Update user profile
    const userData = {
      name: profileData.name,
      role: profileData.role,
      phone_number: profileData.phone_number,
      gender: profileData.gender,
      bio: profileData.bio,
      years_of_experience: profileData.years_of_experience,
      hobbies: profileData.hobbies,
      status: profileData.status,
      coin_balance: profileData.coin_balance,
      address_id: addressId,
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(userData).forEach(key => 
      userData[key] === undefined && delete userData[key]
    )

    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('email', email)
      .select(`
        *,
        address:addresses (*)
      `)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { data: null, error }
  }
}

/**
 * Upload avatar to Supabase storage
 */
export async function uploadAvatar(file, userId) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return { data: data.publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return { data: null, error }
  }
}

/**
 * Contact Student and Deduct Coins
 * Handles the process of contacting a student and deducting coins from tutor
 */
export async function contactStudent(tutorEmail, requestId, coinCost) {
  try {
    // Start a transaction to ensure atomic operation
    const { data, error } = await supabase.rpc('contact_student_deduct_coins', {
      tutor_email: tutorEmail,
      request_id: requestId,
      coin_cost: coinCost
    });

    if (error) throw error;

    // After successful payment, create an initial message to start the conversation
    await createInitialMessage(tutorEmail, requestId);

    return { data, error: null };
  } catch (error) {
    console.error('Error contacting student:', error);
    return { data: null, error };
  }
}

/**
 * Create Initial Message
 * Creates the first message when a tutor contacts a student
 */
export async function createInitialMessage(tutorEmail, requestId) {
  try {
    // Get tutor and student information
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select(`
        *,
        user:users(id, name)
      `)
      .eq('id', requestId)
      .single();

    if (requestError) throw requestError;

    const { data: tutorData, error: tutorError } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', tutorEmail)
      .single();

    if (tutorError) throw tutorError;

    // Create initial message from tutor to student
    const initialMessage = {
      sender_id: tutorData.id,
      recipient_id: requestData.user.id,
      request_id: requestId,
      content: `Hi ${requestData.user.name}, I'm interested in helping you with your "${requestData.title}" request. I'd love to discuss how I can assist you with ${requestData.subjects?.map(s => s.name).join(', ') || 'this subject'}. Feel free to reach out!`,
      read: false
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([initialMessage])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating initial message:', error);
    return { data: null, error };
  }
}

/**
 * Start Conversation
 * Creates a conversation between two users (can be used when clicking Message button)
 */
export async function startConversation(senderId, recipientId, requestId = null, initialContent = null) {
  try {
    // Check if conversation already exists
    const { data: existingMessages, error: checkError } = await supabase
      .from('messages')
      .select('id')
      .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
      .limit(1);

    if (checkError) throw checkError;

    // If conversation doesn't exist, create initial message
    if (!existingMessages || existingMessages.length === 0) {
      const messageData = {
        sender_id: senderId,
        recipient_id: recipientId,
        request_id: requestId,
        content: initialContent || "Hi! I'd like to start a conversation with you.",
        read: false
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, isNew: true };
    }

    return { data: existingMessages[0], error: null, isNew: false };
  } catch (error) {
    console.error('Error starting conversation:', error);
    return { data: null, error };
  }
}

/**
 * Record Contact Activity
 * Records when a tutor contacts a student for analytics
 */
export async function recordContactActivity(tutorEmail, requestId, coinCost) {
  try {
    const { data, error } = await supabase
      .from('contact_activities')
      .insert([{
        tutor_email: tutorEmail,
        request_id: requestId,
        coin_cost: coinCost,
        contacted_at: new Date().toISOString()
      }]);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error recording contact activity:', error);
    return { data: null, error };
  }
}

/**
 * Update Request View Count
 * Increments the view count for a request when tutors view details
 */
export async function incrementRequestViewCount(requestId) {
  try {
    const { data, error } = await supabase.rpc('increment_view_count', {
      request_id: requestId
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return { data: null, error };
  }
}

/**
 * Get Tutor's Students (Contacted Requests)
 * Returns all requests that a tutor has contacted students for
 */
export async function getTutorStudents(tutorEmail) {
  try {
    const { data, error } = await supabase
      .from('contact_activities')
      .select(`
        *,
        request:requests(
          *,
          user:users(id, name, email, avatar_url, phone_number),
          address:addresses(*),
          subjects:request_subjects(subject:subjects(*))
        )
      `)
      .eq('tutor_email', tutorEmail)
      .order('contacted_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match expected format
    const transformedData = data?.map(activity => {
      const request = activity.request;
      return {
        ...request,
        user_id: request.user?.id || null,
        student_name: request.user?.name || 'Student',
        student_email: request.user?.email || 'Email not available',
        student_phone: request.user?.phone_number || 'Phone not available',
        student_avatar: request.user?.avatar_url || null,
        contacted_at: activity.contacted_at,
        coin_cost: activity.coin_cost,
        subjects: request.subjects?.map(s => ({ name: s.subject.name })) || [],
        language: request.language ? JSON.parse(request.language) : [],
        contactInfoAvailable: true, // Tutor has already paid for contact info
        hasAlreadyPaid: true
      };
    }) || [];

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching tutor students:', error);
    return { data: null, error };
  }
}

// ===== AUTH/PASSWORD RESET QUERIES =====

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { data: null, error }
  }
}

/**
 * Update user password with reset token
 */
export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating password:', error)
    return { data: null, error }
  }
}

/**
 * Verify password reset token
 */
export async function verifyPasswordResetToken(token) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error verifying password reset token:', error)
    return { data: null, error }
  }
}

// ===== PAYMENT TRANSACTIONS =====

/**
 * Get user's payment transactions
 */
export async function getUserPaymentTransactions(userEmail, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching payment transactions:', error)
    return { data: null, error }
  }
}

/**
 * Create a payment transaction record
 */
export async function createPaymentTransaction(transactionData) {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(transactionData)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating payment transaction:', error)
    return { data: null, error }
  }
}

/**
 * Update payment transaction status
 */
export async function updatePaymentTransactionStatus(sessionId, status, metadata = {}) {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({ 
        status, 
        metadata: { ...metadata, updated_at: new Date().toISOString() }
      })
      .eq('session_id', sessionId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating payment transaction:', error)
    return { data: null, error }
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfileById(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        address:addresses (*)
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user profile by ID:', error)
    return { data: null, error }
  }
}

/**
 * Deduct coins from user account
 */
export async function deductCoins(userId, amount, description) {
  try {
    // First check if user has enough coins
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('coin_balance')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    if (!user || user.coin_balance < amount) {
      return { data: null, error: 'Insufficient coins' }
    }

    // Deduct coins from user balance
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ coin_balance: user.coin_balance - amount })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) throw updateError

    // Record the transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'debit',
        amount: -amount,
        description: description,
        status: 'completed'
      })
      .select()
      .single()

    if (transactionError) throw transactionError

    return { 
      data: { 
        user: updatedUser, 
        transaction: transaction,
        newBalance: updatedUser.coin_balance
      }, 
      error: null 
    }
  } catch (error) {
    console.error('Error deducting coins:', error)
    return { data: null, error }
  }
}

/**
 * Get tutor profile with enhanced data formatting
 */
export async function getTutorProfileEnhanced(tutorId) {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select(`
        id,
        user_id,
        hourly_rate,
        experience_years,
        education,
        certifications,
        languages,
        teaching_style,
        specializations,
        response_time,
        availability_status,
        verified,
        background_check,
        preferred_meeting_types,
        travel_radius_km,
        minimum_session_duration,
        instant_booking,
        total_sessions,
        total_earnings,
        success_rate,
        response_rate,
        users!inner (
          id,
          name,
          email,
          avatar_url,
          rating,
          total_reviews,
          bio,
          status,
          address_id,
          addresses (
            city,
            state,
            country,
            formatted
          )
        ),
        tutor_subjects (
          id,
          proficiency_level,
          years_experience,
          subjects (
            id,
            name,
            category
          )
        )
      `)
      .eq('user_id', tutorId)
      .eq('users.status', 'active')
      .single()

    if (error) throw error

    // Transform the data for better frontend consumption
    const transformedData = {
      id: data.id,
      user_id: data.user_id,
      name: data.users.name,
      email: data.users.email,
      avatar_url: data.users.avatar_url || "/placeholder.svg?height=128&width=128",
      rating: data.users.rating || 0,
      total_reviews: data.users.total_reviews || 0,
      bio: data.users.bio,
      hourly_rate: data.hourly_rate || 0,
      experience_years: data.experience_years || 0,
      education: data.education,
      certifications: data.certifications || [],
      languages: data.languages || [],
      teaching_style: data.teaching_style,
      specializations: data.specializations || [],
      response_time: data.response_time || '< 24 hours',
      availability_status: data.availability_status || 'available',
      verified: data.verified || false,
      background_check: data.background_check || false,
      preferred_meeting_types: data.preferred_meeting_types || [],
      travel_radius_km: data.travel_radius_km || 10,
      minimum_session_duration: data.minimum_session_duration || 60,
      instant_booking: data.instant_booking || false,
      total_sessions: data.total_sessions || 0,
      total_earnings: data.total_earnings || 0,
      success_rate: data.success_rate || 0,
      response_rate: data.response_rate || 0,
      location: data.users.addresses ? 
        `${data.users.addresses.city || ''}, ${data.users.addresses.state || ''}`.replace(/^,\s*|,\s*$/, '') : 
        'Location not specified',
      subjects: data.tutor_subjects?.map(ts => ({
        id: ts.subjects?.id,
        name: ts.subjects?.name,
        category: ts.subjects?.category,
        proficiency_level: ts.proficiency_level,
        years_experience: ts.years_experience
      })).filter(s => s.name) || []
    }

    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Error fetching enhanced tutor profile:', error)
    return { data: null, error }
  }
}
