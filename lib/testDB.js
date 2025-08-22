import { supabase } from '@/lib/supabaseClient'

// Simple test to check basic database connectivity
export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test 1: Check if we can connect to the database
    const { data: testConnection, error: connectionError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      console.error('Database connection test failed:', connectionError)
      return { success: false, error: connectionError }
    }
    
    console.log('Database connection test passed')
    
    // Test 2: Try to fetch a small amount of data
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('id, name')
      .limit(5)
    
    if (subjectsError) {
      console.error('Subjects fetch test failed:', subjectsError)
      return { success: false, error: subjectsError }
    }
    
    console.log('Subjects fetch test passed:', subjects?.length, 'subjects found')
    
    // Test 3: Try to fetch tutors
    const { data: tutors, error: tutorsError } = await supabase
      .from('tutors')
      .select('id, verified')
      .limit(3)
    
    if (tutorsError) {
      console.error('Tutors fetch test failed:', tutorsError)
      return { success: false, error: tutorsError }
    }
    
    console.log('Tutors fetch test passed:', tutors?.length, 'tutors found')
    
    return { 
      success: true, 
      data: { 
        subjects: subjects?.length || 0, 
        tutors: tutors?.length || 0 
      } 
    }
  } catch (error) {
    console.error('Database test error:', error)
    return { success: false, error }
  }
}

export default testDatabaseConnection
