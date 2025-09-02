import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

/**
 * GET /api/requests/user/[userName]
 * Get all requests created by a specific user name
 */
export async function GET(request, { params }) {
  try {
    const { userName } = params
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const status = searchParams.get('status') || null
    const type = searchParams.get('type') || null
    const limit = parseInt(searchParams.get('limit')) || 20
    const offset = parseInt(searchParams.get('offset')) || 0
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const includeSubjects = searchParams.get('include_subjects') === 'true'
    const includeAddress = searchParams.get('include_address') === 'true'

    if (!userName) {
      return NextResponse.json(
        { 
          error: 'User name is required',
          message: 'Please provide a valid user name in the URL path'
        }, 
        { status: 400 }
      )
    }

    console.log('Fetching requests for user:', userName, 'with filters:', { 
      status, type, limit, offset, sortBy, sortOrder 
    })

    // Build the query with proper joins
    let selectFields = `
      id,
      title,
      description,
      type,
      level,
      status,
      price_amount,
      price_option,
      price_currency,
      price_currency_symbol,
      gender_preference,
      tutors_want,
      i_need_someone,
      language,
      get_tutors_from,
      online_meeting,
      offline_meeting,
      travel_meeting,
      urgency,
      view_count,
      created_at,
      updated_at,
      user:users!inner (
        id,
        name,
        email,
        avatar_url
      )
    `

    // Conditionally include related data
    if (includeAddress) {
      selectFields += `,
      address:addresses (*)`
    }

    if (includeSubjects) {
      selectFields += `,
      subjects:request_subjects (
        id,
        subject:subjects (
          id,
          name,
          category
        )
      )`
    }

    let query = supabase
      .from('requests')
      .select(selectFields, { count: 'exact' })
      .ilike('user.name', `%${decodeURIComponent(userName)}%`)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (type) {
      query = query.eq('type', type)
    }

    // Apply sorting
    const validSortFields = [
      'created_at', 'updated_at', 'price_amount', 'view_count', 'status', 'type'
    ]
    
    if (validSortFields.includes(sortBy)) {
      const ascending = sortOrder.toLowerCase() === 'asc'
      query = query.order(sortBy, { ascending })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

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

    // Transform the data with computed fields
    const transformedRequests = requests?.map(request => {
      const baseRequest = {
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
        user: request.user,
        // Computed fields
        meeting_types: [
          request.online_meeting && 'Online',
          request.offline_meeting && 'Offline', 
          request.travel_meeting && 'Travel'
        ].filter(Boolean),
        formatted_price: `${request.price_currency_symbol || '₹'}${request.price_amount} ${request.price_option}`,
        days_since_created: Math.floor((new Date() - new Date(request.created_at)) / (1000 * 60 * 60 * 24)),
        is_recent: (new Date() - new Date(request.created_at)) < (7 * 24 * 60 * 60 * 1000) // Less than 7 days
      }

      // Add optional fields if requested
      if (includeAddress && request.address) {
        baseRequest.address = request.address
        baseRequest.location = request.address ? 
          `${request.address.city || ''}, ${request.address.state || ''}`.replace(/^,\s*|,\s*$/, '') : 
          'Location not specified'
      }

      if (includeSubjects && request.subjects) {
        baseRequest.subjects = request.subjects?.map(rs => ({
          id: rs.subject?.id,
          name: rs.subject?.name,
          category: rs.subject?.category
        })) || []
        baseRequest.subject_names = request.subjects?.map(rs => rs.subject?.name).filter(Boolean) || []
      }

      return baseRequest
    }) || []

    // Calculate statistics
    const stats = {
      total_requests: count,
      open_requests: transformedRequests.filter(r => r.status === 'open').length,
      closed_requests: transformedRequests.filter(r => r.status === 'closed').length,
      in_progress_requests: transformedRequests.filter(r => r.status === 'in_progress').length,
      recent_requests: transformedRequests.filter(r => r.is_recent).length,
      average_price: transformedRequests.length > 0 ? 
        transformedRequests.reduce((sum, r) => sum + (r.price_amount || 0), 0) / transformedRequests.length : 0,
      total_views: transformedRequests.reduce((sum, r) => sum + (r.view_count || 0), 0)
    }

    // Response with metadata
    const response = {
      data: transformedRequests,
      metadata: {
        user_name: userName,
        total_count: count,
        returned_count: transformedRequests.length,
        limit,
        offset,
        has_more: count > (offset + limit),
        page: Math.floor(offset / limit) + 1,
        total_pages: Math.ceil(count / limit),
        filters: {
          status,
          type,
          sort_by: sortBy,
          sort_order: sortOrder,
          include_subjects: includeSubjects,
          include_address: includeAddress
        }
      },
      statistics: stats,
      success: true
    }

    console.log(`Successfully fetched ${transformedRequests.length} requests for user: ${userName}`)
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching user requests',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}
