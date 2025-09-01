"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { uploadAvatar, createRequest, getOrCreateUser } from "@/lib/supabaseAPI"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingRequest, setPendingRequest] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const refreshUserData = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        // Don't await this to prevent blocking
        const profileResult = await getOrCreateUser(session.user);

        if (profileResult.data) {
          console.log('Profile loaded in refreshUserData:', profileResult.data)
          console.log('Address data in refreshUserData:', profileResult.data.address)
          setProfile(profileResult.data)
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
        console.log('Auth state change:', event, session?.user?.email)
        // Check for pending requests in localStorage after authentication
        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            createRequestInLocalStorage(session.user.email)
          }, 1000);
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
        createRequestInLocalStorage,
        isWalletModalOpen,
        setIsWalletModalOpen,
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