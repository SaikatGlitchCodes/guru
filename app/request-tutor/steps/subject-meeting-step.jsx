// components/steps/subject-meeting-step.tsx
import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import CreatableSelect from 'react-select/creatable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabaseClient";


const requestTypes = ["Tutoring", "Job Support", "Assignment"]
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
        setSubjects((response.data || []).map(subject => ({ value: subject.id, label: subject.name, id: subject.id })))
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
    setLoading(false)
  }, [])

  const handleChange = async (selectedOptions) => {
    setSelectedSubject(selectedOptions || []);
    const subjectIds = selectedOptions ? selectedOptions.map(option => option.id) : [];
    console.log("Selected subject IDs:", subjectIds);
    form.setValue('subject', subjectIds);
  };

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
        const newOption = { value: data.id, label: data.name, id: data.id };
        setSubjects((prev) => [...prev, newOption]);
        setSelectedSubject((prev) => [...prev, newOption]);
        form.setValue('subject', [...form.getValues('subject') || [], newOption.id]);
      })
      .finally(() => {
        setLoading(false);
      });
  }


  return (
    <div className="space-y-6">
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
                noOptionsMessage={() => error ? 'Error loading subjects' : 'No Categories Found'}
                isLoading={loading}
                onChange={(selectedOptions) => {
                  const subjectIds = selectedOptions.map(option => option.id);
                  field.onChange(subjectIds);
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

      {/* Request type */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>I Want</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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