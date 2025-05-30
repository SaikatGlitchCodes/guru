"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUserData = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        const { data: response } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        console.log("Fetched profile:", response)
        if (response) {
          setProfile(response)
        } else {
          // If no profile found, you might want to create one
          // await createUserProfile({ email: session.user.email, name: session.user.user_metadata.full_name })
          setProfile(null)
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const { data: response } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

        console.log("fetched profile")
        
          if (response) {
            setProfile(response)
          } else {
            // If no profile found, you might want to create one
            // await createUserProfile({ email: session.user.email, name: session.user.user_metadata.full_name })
            setProfile(null)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshUserData
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