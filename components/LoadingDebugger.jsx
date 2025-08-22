"use client"

import { useUser } from "@/contexts/UserContext"
import { useState, useEffect } from "react"
import testDatabaseConnection from "@/lib/testDB"

export default function LoadingDebugger() {
  const { user, profile, loading } = useUser()
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState({})
  const [dbTestResult, setDbTestResult] = useState(null)

  useEffect(() => {
    setDebugInfo({
      timestamp: new Date().toISOString(),
      userLoading: loading,
      hasUser: !!user,
      hasProfile: !!profile,
      userEmail: user?.email,
      profileRole: profile?.role,
      profileName: profile?.name
    })
  }, [user, profile, loading])

  // Show debug info if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowDebug(true)
        // Run database test when showing debug info
        testDatabaseConnection().then(setDbTestResult)
      }
    }, 5000) // Show after 5 seconds of loading

    return () => clearTimeout(timer)
  }, [loading])

  const runDbTest = async () => {
    setDbTestResult({ testing: true })
    const result = await testDatabaseConnection()
    setDbTestResult(result)
  }

  const forceLoadContent = () => {
    // Force the loading states to false
    window.location.hash = 'force-load'
    window.location.reload()
  }

  if (!showDebug && !loading) return null

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg text-sm z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-800">Loading Debug Info</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          ×
        </button>
      </div>
      <div className="space-y-1 text-yellow-700">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {debugInfo.hasUser ? '✓' : '✗'}</div>
        <div>Profile: {debugInfo.hasProfile ? '✓' : '✗'}</div>
        {debugInfo.userEmail && <div>Email: {debugInfo.userEmail}</div>}
        {debugInfo.profileRole && <div>Role: {debugInfo.profileRole}</div>}
        <div>Updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
        
        {dbTestResult && (
          <div className="mt-2 pt-2 border-t border-yellow-300">
            <div className="font-semibold">DB Test:</div>
            {dbTestResult.testing ? (
              <div>Testing...</div>
            ) : dbTestResult.success ? (
              <div className="text-green-700">
                ✓ Success: {dbTestResult.data?.subjects} subjects, {dbTestResult.data?.tutors} tutors
              </div>
            ) : (
              <div className="text-red-700">
                ✗ Failed: {dbTestResult.error?.message}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
        >
          Refresh
        </button>
        <button 
          onClick={runDbTest}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Test DB
        </button>
        <button 
          onClick={forceLoadContent}
          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Force Load
        </button>
      </div>
    </div>
  )
}
