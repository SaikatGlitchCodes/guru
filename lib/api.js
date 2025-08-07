import { updateProfile as updateProfileAPI, createRequest as createRequestAPI } from './supabaseAPI'

const BACKENDAPI = process.env.NEXT_PUBLIC_EXTERNAL_API_URL

export const updateProfile = async (profile, email) => {
    return await updateProfileAPI(profile, email)
}

export const createRequest = async (requestData) => {
    return await createRequestAPI(requestData)
}