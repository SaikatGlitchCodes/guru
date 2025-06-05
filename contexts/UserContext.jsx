"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { createRequest } from "@/lib/api"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pendingRequest, setPendingRequest] = useState(false)

  const refreshUserData = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)

        try {
          const { data: response } = await supabase
            .from('users')
            .select('*, address : addresses(*), subjects(*)')
            .eq('email', session.user.email)
            .single()

          if (response) {
            setProfile(response)
          } else {
            setProfile(null)
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError)
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
    createRequestInLocalStorage()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)

          try {
            const { data: response } = await supabase
              .from('users')
              .select('*, address : addresses(*), subjects(*)')
              .eq('email', session.user.email)
              .single()

            if (response) {
              setProfile(response)
            } else {
              setProfile(null)
            }
          } catch (error) {
            console.error("Error fetching profile in auth change:", error)
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
    if (!file || !userEmail) return { error: 'Missing file or email' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userEmail}_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profile')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload failed:', uploadError)
      return { error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('profile')
      .getPublicUrl(filePath)

    // Update user profile with the avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl }) // Changed from profile_img to avatar_url
      .eq('email', userEmail)

    if (updateError) {
      console.error('Error updating user profile:', updateError)
      return { error: updateError.message }
    }

    // Update the local profile state to reflect the change
    setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev)

    return { publicUrl }
  }

  async function signInWithMagicLink(email) {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: '/',
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

  function createRequestInLocalStorage() {
    try {
      const requestData = JSON.parse(localStorage.getItem("pendingTutorRequest"))
      if (!requestData) {
        console.warn("No pending request data found in localStorage")
        return
      }
      else {
        setPendingRequest(true)
        if (user) {
          createRequest(requestData).then(() => {
            console.log("Request created successfully from localStorage data")
            localStorage.removeItem("pendingTutorRequest")
          }).catch((error) => {
            console.error("Error creating request from localStorage data:", error)
          }
          )
        }

      }
    } catch (error) {
      console.error("Error storing request data in localStorage:", error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        signInWithMagicLink,
        refreshUserData,
        uploadAvatarToSupabase,
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