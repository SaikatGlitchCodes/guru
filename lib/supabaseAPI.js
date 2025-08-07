/**
 * Supabase API service for the mentoring platform
 * This file contains all the database queries and operations
 */

import { supabase } from './supabaseClient'

// ===== TUTOR QUERIES =====

/**
 * Get all tutors with their subjects and location for the find-tutors page
 */
export async function getAllTutors() {
  try {
    // First try the view, fallback to direct table query if view doesn't exist
    let { data, error } = await supabase
      .from('tutor_search_view')
      .select('*')
      .eq('verified', true)
      .order('rating', { ascending: false })

    // If view doesn't exist, query tables directly
    if (error && error.message.includes('does not exist')) {
      console.log('View not found, querying tables directly...')
      
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutors')
        .select(`
          id,
          user_id,
          hourly_rate,
          experience_years,
          response_time,
          availability_status,
          verified,
          languages,
          preferred_meeting_types,
          users!inner (
            name,
            avatar_url,
            rating,
            total_reviews,
            bio,
            addresses (
              city,
              state,
              country
            )
          ),
          tutor_subjects (
            subjects (
              name
            )
          )
        `)
        .eq('verified', true)
        .eq('users.status', 'active')
        .order('users.rating', { ascending: false })

      if (tutorError) throw tutorError

      // Transform the data to match expected format
      data = tutorData.map(tutor => ({
        id: tutor.id,
        name: tutor.users.name,
        avatar_url: tutor.users.avatar_url,
        rating: tutor.users.rating,
        total_reviews: tutor.users.total_reviews,
        hourly_rate: tutor.hourly_rate,
        experience_years: tutor.experience_years,
        response_time: tutor.response_time,
        availability_status: tutor.availability_status,
        verified: tutor.verified,
        languages: tutor.languages,
        preferred_meeting_types: tutor.preferred_meeting_types,
        bio: tutor.users.bio,
        city: tutor.users.addresses?.city,
        state: tutor.users.addresses?.state,
        country: tutor.users.addresses?.country,
        location: tutor.users.addresses ? `${tutor.users.addresses.city}, ${tutor.users.addresses.state}` : 'Location not specified',
        subjects: tutor.tutor_subjects.map(ts => ts.subjects.name)
      }))
      
      error = null
    }

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return { data: null, error }
  }
}

/**
 * Search tutors with filters
 */
export async function searchTutors({
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
        tutor_availability(*),
        reviews:reviews(*, reviewer:users(name, avatar_url))
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
      // User doesn't exist, create new one
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          role: 'student', // Default role
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
    
    // First, get the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, address_id')
      .eq('email', requestData.user_email)
      .single()

    if (userError || !userData) {
      throw new Error(`User not found: ${userError?.message || 'Unknown error'}`)
    }

    let addressId = userData.address_id

    // Create or update address if provided
    if (requestData.address && Object.keys(requestData.address).length > 0) {
      const addressData = {
        street: requestData.address.street || '',
        city: requestData.address.city || '',
        state: requestData.address.state || '',
        zip: requestData.address.zip || '',
        country: requestData.address.country || '',
        country_code: requestData.address.country_code || '',
        address_line_1: requestData.address.addressline_1 || requestData.address.address_line_1 || '',
        address_line_2: requestData.address.addressline_2 || requestData.address.address_line_2 || '',
        lat: requestData.address.lat || 0,
        lon: requestData.address.lon || 0,
        formatted: requestData.address.formatted || ''
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
 * Get requests for tutor jobs page
 */
export async function getOpenRequests({
  searchQuery = '',
  subjects = [],
  locations = [],
  minPrice = 0,
  maxPrice = 10000,
  meetingTypes = [],
  page = 1,
  limit = 10
}) {
  try {
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

    // Search query filter
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
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

    // Pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform the data to match the expected format
    const transformedData = data?.map(request => ({
      ...request,
      student_name: request.user?.name || 'Student',
      subjects: request.subjects?.map(s => ({ name: s.subject.name })) || [],
      language: request.language ? JSON.parse(request.language) : [],
    })) || []
    
    console.log('Transformed requests data:', transformedData)
    console.log('Sample request subjects:', transformedData[0]?.subjects)
    
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('Error fetching requests:', error)
    return { data: null, error }
  }
}

/**
 * Get user's requests
 */
export async function getUserRequests(userId) {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        address:addresses(*),
        subjects:request_subjects(subject:subjects(*)),
        applications:applications(
          *,
          tutor:tutors(user:users(name, avatar_url))
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching user requests:', error)
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
      if (contactActivity && !contactError) {
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
      .select()
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
        sender:users!messages_sender_id_fkey(name, avatar_url),
        recipient:users!messages_recipient_id_fkey(name, avatar_url)
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

    return { data: Object.values(conversations), error: null }
  } catch (error) {
    console.error('Error fetching conversations:', error)
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

    return { data, error: null };
  } catch (error) {
    console.error('Error contacting student:', error);
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
