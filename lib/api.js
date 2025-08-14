import { updateProfile as updateProfileAPI, createRequest as createRequestAPI, updateRequestStatus as updateRequestStatusAPI } from './supabaseAPI'

const BACKENDAPI = process.env.NEXT_PUBLIC_EXTERNAL_API_URL

export const updateProfile = async (profile, email) => {
    return await updateProfileAPI(profile, email)
}

export const createRequest = async (requestData) => {
    return await createRequestAPI(requestData)
}

export const updateRequestStatus = async (requestId, status, userEmail) => {
    return await updateRequestStatusAPI(requestId, status, userEmail)
}

/**
 * Get all requests created by a user name or email
 * @param {Object} params - Search parameters
 * @param {string} params.user_name - User name to search for
 * @param {string} params.user_email - User email to search for
 * @param {string} params.status - Filter by request status (optional)
 * @param {number} params.limit - Number of results to return (default: 50)
 * @param {number} params.offset - Number of results to skip (default: 0)
 * @returns {Promise<Object>} Response with requests data
 */
export const getRequestsByUser = async (params = {}) => {
    try {
        const searchParams = new URLSearchParams()
        
        if (params.user_name) searchParams.append('user_name', params.user_name)
        if (params.user_email) searchParams.append('user_email', params.user_email)
        if (params.status) searchParams.append('status', params.status)
        if (params.limit) searchParams.append('limit', params.limit.toString())
        if (params.offset) searchParams.append('offset', params.offset.toString())
        
        const response = await fetch(`/api/requests?${searchParams.toString()}`)
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return { data: data.data, metadata: data.metadata, error: null }
        
    } catch (error) {
        console.error('Error fetching requests by user:', error)
        return { data: null, metadata: null, error: error.message }
    }
}