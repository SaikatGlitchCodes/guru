import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userName = searchParams.get('user_name')
    const userEmail = searchParams.get('user_email')
    const status = searchParams.get('status') || null
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0

    // Validate that at least one search parameter is provided
    if (!userName && !userEmail) {
      return NextResponse.json(
        { 
          error: 'Either user_name or user_email parameter is required',
          message: 'Please provide user_name or user_email to search for requests'
        }, 
        { status: 400 }
      )
    }

    console.log('Fetching requests for:', { userName, userEmail, status, limit, offset })

    // Build the query
    let query = supabase
      .from('requests')
      .select(`
        *,
        user:users!inner (
          id,
          name,
          email,
          avatar_url
        ),
        address:addresses (*),
        subjects:request_subjects (
          id,
          subject:subjects (
            id,
            name,
            category
          )
        )
      `)

    // Add filters based on provided parameters
    if (userName) {
      query = query.ilike('user.name', `%${userName}%`)
    }
    
    if (userEmail) {
      query = query.eq('user.email', userEmail)
    }

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Add ordering and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: requests, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          error: 'Database query failed',
          message: error.message,
          details: error
        }, 
        { status: 500 }
      )
    }

    // Transform the data to include computed fields
    const transformedRequests = requests?.map(request => ({
      id: request.id,
      title: request.title,
      description: request.description,
      type: request.type,
      level: request.level,
      status: request.status,
      price_amount: request.price_amount,
      price_option: request.price_option,
      price_currency: request.price_currency,
      price_currency_symbol: request.price_currency_symbol,
      gender_preference: request.gender_preference,
      tutors_want: request.tutors_want,
      i_need_someone: request.i_need_someone,
      language: request.language ? JSON.parse(request.language) : [],
      get_tutors_from: request.get_tutors_from,
      online_meeting: request.online_meeting,
      offline_meeting: request.offline_meeting,
      travel_meeting: request.travel_meeting,
      urgency: request.urgency,
      view_count: request.view_count || 0,
      created_at: request.created_at,
      updated_at: request.updated_at,
      // User information
      user: {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
        avatar_url: request.user.avatar_url
      },
      // Address information
      address: request.address,
      // Subjects information
      subjects: request.subjects?.map(rs => ({
        id: rs.subject?.id,
        name: rs.subject?.name,
        category: rs.subject?.category
      })) || [],
      // Computed fields
      subject_names: request.subjects?.map(rs => rs.subject?.name).filter(Boolean) || [],
      meeting_types: [
        request.online_meeting && 'Online',
        request.offline_meeting && 'Offline', 
        request.travel_meeting && 'Travel'
      ].filter(Boolean),
      formatted_price: `${request.price_currency_symbol || '$'}${request.price_amount} ${request.price_option}`,
      location: request.address ? 
        `${request.address.city || ''}, ${request.address.state || ''}`.replace(/^,\s*|,\s*$/, '') : 
        'Location not specified'
    })) || []

    // Prepare response with metadata
    const response = {
      data: transformedRequests,
      metadata: {
        total_results: transformedRequests.length,
        limit,
        offset,
        search_params: {
          user_name: userName,
          user_email: userEmail,
          status
        }
      },
      success: true
    }

    console.log(`Successfully fetched ${transformedRequests.length} requests`)
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching requests',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}

// Handle POST requests to create new requests (optional - using existing createRequest)
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Import the createRequest function
    const { createRequest } = await import('@/lib/supabaseAPI')
    
    const result = await createRequest(body)
    
    if (result.error) {
      return NextResponse.json(
        { 
          error: 'Failed to create request',
          message: result.error,
          details: result.error
        }, 
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: result.data,
      success: true,
      message: 'Request created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while creating the request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}
