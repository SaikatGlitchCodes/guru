// components/steps/subject-meeting-step.tsx
import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CreatableSelect from 'react-select/creatable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabaseClient";
import { BookOpen, Users, ClipboardList } from "lucide-react"
import { createSubject, getAllSubjects } from "@/lib/supabaseAPI";


const requestTypes = [
  {
    value: "Tutoring",
    label: "Tutoring",
    icon: BookOpen,
    description: "Get personalized learning sessions",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-600"
  },
  {
    value: "Job Support", 
    label: "Job Support",
    icon: Users,
    description: "Career mentoring & interview prep",
    color: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-600"
  },
  {
    value: "Assignment",
    label: "Assignment Help", 
    icon: ClipboardList,
    description: "Help with homework & projects",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    iconColor: "text-purple-600"
  }
]
const levels = [
  "Beginner", "Intermediate", "Advanced",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11",
]

export function SubjectMeetingStep({ form }) {
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSubjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAllSubjects()
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      setSubjects((response.data || []).map(subject => ({ value: subject.name, label: subject.name, id: subject.id })))
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setError(error.message || 'Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleCreateSubject = async (newSubject) => {
    setLoading(true);
    const { data, error } = await createSubject(newSubject);
    if (error) {
      console.error('Error creating subject:', error);
      setError(error.message || 'Failed to create subject');
    } else {
      const newOption = { value: data.name, label: data.name, id: data.id };
      setSubjects((prev) => [...prev, newOption]);
      setSelectedSubject((prev) => [...prev, newOption]);
      form.setValue('subject', [...form.getValues('subject') || [], newOption]);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 border-t-2 md:pt-12 pt-5">


      {/* Subject selection */}
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Subjects</FormLabel>
              {error && (
                <button
                  type="button"
                  onClick={fetchSubjects}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                  disabled={loading}
                >
                  {loading ? 'Reloading...' : 'Reload'}
                </button>
              )}
            </div>
            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 mb-2 dark:bg-red-950">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Error:</strong> {error}. Click reload to try again.
                </p>
              </div>
            )}
            <FormControl>
              <CreatableSelect
                isMulti
                isClearable
                placeholder={error ? 'Error loading subjects - click reload' : 'Search subjects...'}
                allowCreateWhileLoading
                options={subjects}
                noOptionsMessage={() => error ? 'Error loading subjects - click reload above' : 'No Categories Found'}
                isLoading={loading}
                isDisabled={!!error && !loading}
                onChange={(selectedOptions) => {
                  field.onChange(selectedOptions);
                  setSelectedSubject(selectedOptions);
                }}
                onCreateOption={handleCreateSubject}
                value={selectedSubject}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Level selection */}
      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem >
            <FormLabel>Your Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Request type - Enhanced UI - Moved to top for priority */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What type of help do you need?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose the option that best describes what you're looking for" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className={`w-4 h-4 ${type.iconColor}`} />
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <span className="text-xs text-gray-500 ml-2">- {type.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meeting options */}
      <FormField
        control={form.control}
        name="meeting_options"
        render={() => (
          <FormItem>
            <FormLabel>Meeting Options</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <FormField
                control={form.control}
                name="meeting_options.Online.state"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Online (over zoom, google meet, etc)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meeting_options.Offline.state"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      In-person (Home/Institute)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meeting_options.Travel.state"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Willing to travel
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default SubjectMeetingStep