// components/steps/subject-meeting-step.tsx
import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CreatableSelect from 'react-select/creatable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient";
import { BookOpen, Users, ClipboardList, Star } from "lucide-react"


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

  useEffect(() => {
    setLoading(true)
    const fetchSubjects = async () => {
      try {
        const response = await supabase
          .from('subjects')
          .select('id, name')
        setSubjects((response.data || []).map(subject => ({ value: subject.name, label: subject.name, id: subject.id })))
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
    setLoading(false)
  }, [])

  const handleCreateSubject = async (newSubject) => {
    setLoading(true);
    supabase
      .from('subjects')
      .insert({ name: newSubject, created_at: new Date(), updated_at: new Date() })
      .select('id, name')
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error creating subject:', error);
          return;
        }
        const newOption = { value: data.name, label: data.name, id: data.id };
        setSubjects((prev) => [...prev, newOption]);
        setSelectedSubject((prev) => [...prev, newOption]);
        form.setValue('subject', [...form.getValues('subject') || [], newOption]);
      })
      .finally(() => {
        setLoading(false);
      });
  }


  return (
    <div className="space-y-4 border-t-2 pt-12">
      {/* Request type - Enhanced UI - Moved to top for priority */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                What type of help do you need?
              </FormLabel>
              <p className="text-sm text-gray-600 mt-1">Choose the option that best describes what you're looking for</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {requestTypes.map((type) => {
                const IconComponent = type.icon
                const isSelected = field.value === type.value
                return (
                  <div 
                    key={type.value}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'shadow-md' + type.color
                        : ''
                    }`}
                    onClick={() => field.onChange(type.value)}
                  >
                    <div className="p-2 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                        isSelected ? type.color : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          isSelected ? type.iconColor : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className={`font-medium mb-1 text-sm ${
                        isSelected ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {type.description}
                      </p>
                      {isSelected && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subject selection */}
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subjects</FormLabel>
            <FormControl>
              <CreatableSelect
                isMulti
                isClearable
                placeholder='Search subjects...'
                allowCreateWhileLoading
                options={subjects}
                noOptionsMessage={(error) => error ? 'Error loading subjects' : 'No Categories Found'}
                isLoading={loading}
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
          <FormItem>
            <FormLabel>Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
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
                      Online
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
                      In-person
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