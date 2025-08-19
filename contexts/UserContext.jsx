"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { getUserProfile, uploadAvatar, createRequest, getOrCreateUser } from "@/lib/supabaseAPI"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingRequest, setPendingRequest] = useState(false)

  const refreshUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)

        // Try to fetch profile from database
        const profileResult = await getUserProfile(session.user.email)
        
        if (profileResult.data) {
          console.log('Profile loaded in refreshUserData:', profileResult.data)
          console.log('Address data in refreshUserData:', profileResult.data.address)
          setProfile(profileResult.data)
        } else {
          console.log('No profile found, creating basic profile', session.user);
          getOrCreateUser(session.user)
          // Create a basic profile structure if none exists
          setProfile({
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            role: 'student',
            status: 'active',
            coin_balance: 0,
            rating: 0,
            total_reviews: 0,
            profile_completion_percentage: 0
          })
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUserData()
    localStorage.getItem("pendingTutorRequest") && setPendingRequest(true)
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only process actual auth changes, not just session checks
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
          if (session?.user) {
            setUser(session.user)

            try {
              const profileResult = await getUserProfile(session.user.email)
              
              if (profileResult.data) {
                console.log('Profile updated from auth change:', profileResult.data)
                console.log('Address from auth change:', profileResult.data.address)
                setProfile(profileResult.data)
              } else {
                console.log('No profile found in auth change, creating basic profile')
                // Create a basic profile structure if none exists
                getOrCreateUser(session.user)
                setProfile({
                  email: session.user.email,
                  name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                  role: 'student',
                  status: 'active',
                  coin_balance: 0,
                  rating: 0,
                  total_reviews: 0,
                  profile_completion_percentage: 0
                })
              }
            } catch (error) {
              console.error("Error fetching profile in auth change:", error)
              setProfile(null)
            }

            // Check for pending requests in localStorage after authentication
            if (event === 'SIGNED_IN') {
              setTimeout(() => {
                createRequestInLocalStorage(session.user.email)
              }, 1000) // Small delay to ensure profile is loaded
            }
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      }
    )
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatarToSupabase = async (file, userEmail) => {
    if (!file || !userEmail) {
      return { error: 'File and user email are required' }
    }

    try {
      const result = await uploadAvatar(file, userEmail)
      
      if (result.error) {
        return { error: result.error.message || 'Upload failed' }
      }

      // Update user profile with the avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: result.data })
        .eq('email', userEmail)

      if (updateError) {
        console.error('Error updating user profile:', updateError)
        return { error: updateError.message }
      }

      // Update the local profile state
      setProfile(prev => prev ? { ...prev, avatar_url: result.data } : prev)

      return result.data
    } catch (error) {
      console.error('Upload error:', error)
      return { error: error.message || 'Upload failed' }
    }
  }

  async function signInWithMagicLink(email) {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      console.log("Magic link sent to:", email, session)
      if (session?.user) {
        setUser(session.user)
        await refreshUserData()
      }
    } catch (error) {
      console.error("Error during sign-in:", error)
      return
    } finally {
      setLoading(false)
    }
  }

  function createRequestInLocalStorage(email) {
    try {
      const requestData = JSON.parse(localStorage.getItem("pendingTutorRequest"))
      if (!requestData) {
        console.warn("No pending request data found in localStorage")
        return
      }
      else {
        setPendingRequest(true)
        console.log("Pending request data found in localStorage:", requestData, "email:", email)
        if (email) {
          // Create the request using the API
          createRequest(requestData)
            .then((result) => {
              if (result.error) {
                console.error("Error creating request:", result.error)
              } else {
                console.log("Request created successfully:", result.data)
                localStorage.removeItem("pendingTutorRequest")
                // Also clear the form persistence data
                try {
                  localStorage.removeItem("tutorRequestForm")
                } catch (e) {
                  console.warn("Could not clear form persistence data:", e)
                }
                setPendingRequest(false)
              }
            })
            .catch((error) => {
              console.error("Error creating request:", error)
              setPendingRequest(false)
            })
        }
      }
    } catch (error) {
      console.error("Error processing request data from localStorage:", error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        setProfile,
        loading,
        signOut,
        signInWithMagicLink,
        refreshUserData,
        uploadAvatarToSupabase,
        createRequestInLocalStorage,
        isRequestInLocalStorage: pendingRequest
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}