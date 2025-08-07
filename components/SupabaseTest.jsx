"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SupabaseTest() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState([])

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    const results = []
    
    // Test 1: Environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    results.push(`✅ Supabase URL: ${hasUrl ? 'Set' : '❌ Missing'}`)
    results.push(`✅ Supabase Key: ${hasKey ? 'Set' : '❌ Missing'}`)
    
    if (!hasUrl || !hasKey) {
      setStatus('❌ Environment variables missing')
      setDetails(results)
      return
    }

    try {
      // Test 2: Basic connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        results.push(`❌ Connection error: ${error.message}`)
        setStatus('❌ Connection failed')
      } else {
        results.push('✅ Supabase connection successful')
        results.push(`✅ Session: ${data.session ? 'Active' : 'None'}`)
        
        // Test 3: Database query
        try {
          const { data: testData, error: dbError } = await supabase
            .from('users')
            .select('count')
            .limit(1)
          
          if (dbError) {
            results.push(`⚠️ Database query error: ${dbError.message}`)
            results.push('💡 You may need to run database migrations')
          } else {
            results.push('✅ Database connection successful')
          }
        } catch (dbErr) {
          results.push(`⚠️ Database test failed: ${dbErr.message}`)
        }
        
        setStatus('✅ Supabase is working!')
      }
    } catch (err) {
      results.push(`❌ Unexpected error: ${err.message}`)
      setStatus('❌ Test failed')
    }
    
    setDetails(results)
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-blue-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold text-lg mb-2">🧪 Supabase Test</h3>
      <div className="text-sm mb-2">
        <strong>Status:</strong> {status}
      </div>
      <div className="text-xs space-y-1">
        {details.map((detail, index) => (
          <div key={index}>{detail}</div>
        ))}
      </div>
      <button 
        onClick={testSupabaseConnection}
        className="mt-2 px-2 py-1 bg-blue-700 rounded text-xs hover:bg-blue-600"
      >
        Retest
      </button>
    </div>
  )
}
