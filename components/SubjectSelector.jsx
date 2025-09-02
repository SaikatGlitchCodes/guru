"use client"

import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CreatableSelect from 'react-select/creatable'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X, BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const proficiencyLevels = [
  "Beginner",
  "Intermediate", 
  "Advanced",
  "Expert"
]

export function SubjectSelector({ 
  form, 
  userSubjects, 
  setUserSubjects, 
  onAddSubject, 
  onRemoveSubject, 
  currentRole 
}) {
  const [allSubjects, setAllSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedProficiency, setSelectedProficiency] = useState("Intermediate")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load all subjects
  const loadSubjects = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await supabase
        .from('subjects')
        .select('id, name')
        .order('name')
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      setAllSubjects(response.data || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setError(error.message || 'Failed to load subjects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleCreateSubject = async (newSubjectName) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({ 
          name: newSubjectName, 
          created_at: new Date(), 
          updated_at: new Date() 
        })
        .select('id, name')
        .single()

      if (error) throw error

      // Add to local subjects list
      setAllSubjects(prev => [...prev, data])
      
      return data
    } catch (error) {
      console.error('Error creating subject:', error)
      setError('Failed to create subject')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSubject = async () => {
    if (!selectedSubject) return

    // Check if subject already exists for user
    if (userSubjects.some(us => us.subject_id === selectedSubject)) {
      setError('Subject already added')
      return
    }

    try {
      const proficiency = currentRole === 'tutor' ? selectedProficiency : null
      await onAddSubject(selectedSubject, proficiency)
      setSelectedSubject("")
      setSelectedProficiency("Intermediate")
      setError(null)
    } catch (error) {
      setError(error.message || 'Failed to add subject')
    }
  }

  const getSubjectOptions = () => {
    return allSubjects
      .filter(subject => !userSubjects.some(us => us.subject_id === subject.id))
      .map(subject => ({
        value: subject.id,
        label: subject.name
      }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Your Subjects
        </CardTitle>
        <CardDescription>
          {currentRole === 'tutor' 
            ? 'Manage subjects you can teach and your expertise level'
            : 'Manage subjects you\'re interested in learning'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error display */}
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
            <button
              type="button"
              onClick={loadSubjects}
              className="text-sm text-blue-600 hover:text-blue-800 underline mt-1"
              disabled={isLoading}
            >
              {isLoading ? 'Reloading...' : 'Reload Subjects'}
            </button>
          </div>
        )}

        {/* Add new subject section */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-900">Add New Subject</h4>
          
          <div className="grid gap-4">
            {/* Subject Selection with Create Option */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <CreatableSelect
                isClearable
                placeholder={error ? 'Error loading subjects - click reload above' : 'Search or create subject...'}
                options={getSubjectOptions()}
                isLoading={isLoading}
                isDisabled={!!error && !isLoading}
                onChange={(option) => setSelectedSubject(option?.value || "")}
                onCreateOption={async (inputValue) => {
                  const newSubject = await handleCreateSubject(inputValue)
                  if (newSubject) {
                    setSelectedSubject(newSubject.id)
                  }
                }}
                value={getSubjectOptions().find(option => option.value === selectedSubject) || null}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: '40px',
                    borderColor: '#d1d5db'
                  })
                }}
              />
            </div>

            {/* Proficiency Level for Tutors */}
            {currentRole === 'tutor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Proficiency Level
                </label>
                <Select value={selectedProficiency} onValueChange={setSelectedProficiency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Add Button */}
            <Button
              type="button"
              onClick={handleAddSubject}
              disabled={!selectedSubject || isLoading}
              size="sm"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Current Subjects Display */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900">
            Current Subjects ({userSubjects.length})
          </h4>
          
          {userSubjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userSubjects.map((userSubject) => (
                <Badge
                  key={userSubject.id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 text-sm"
                >
                  <span className="font-medium">{userSubject.subject?.name}</span>
                  {currentRole === 'tutor' && userSubject.proficiency_level && (
                    <span className="text-xs text-gray-600 bg-white px-1 rounded">
                      {userSubject.proficiency_level}
                    </span>
                  )}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => onRemoveSubject(userSubject.subject_id)}
                  />
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">
                {currentRole === 'tutor' 
                  ? 'No subjects added yet. Add subjects you can teach.'
                  : 'No subjects added yet. Add subjects you\'re interested in learning.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Teaching Experience Slider for Tutors */}
        {currentRole === 'tutor' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm text-blue-900">Teaching Experience</h4>
            <FormField
              control={form.control}
              name="tutor.experience_years"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm text-blue-800">
                        Years of Experience
                      </FormLabel>
                      <span className="text-sm font-medium text-blue-800">
                        {field.value || 0} years
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-blue-600">
                      <span>0 years</span>
                      <span>15 years</span>
                      <span>30+ years</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Hourly Rate Slider for Tutors */}
        {currentRole === 'tutor' && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-sm text-green-900">Pricing</h4>
            <FormField
              control={form.control}
              name="tutor.hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm text-green-800">
                        Hourly Rate
                      </FormLabel>
                      <span className="text-sm font-medium text-green-800">
                        ₹{field.value || 0}/hour
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-green-600">
                      <span>₹0</span>
                      <span>₹100</span>
                      <span>₹200+</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
