"use client"

import { useState, useEffect } from "react"
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { getAllSubjects, getTutorSubjectsByEmail, addTutorSubjectByEmail, removeTutorSubjectByEmail, updateTutorSubjectByEmail, createSubject } from "@/lib/supabaseAPI"
import CreatableSelect from 'react-select/creatable';

export default function Subject({ form }) {
  const [error, setError] = useState(null);

  // Subjects state
  const [allSubjects, setAllSubjects] = useState([]);
  const [tutorSubjects, setTutorSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(false);

  // Subject proficiency modal state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubjectData, setSelectedSubjectData] = useState(null);
  const [subjectProficiency, setSubjectProficiency] = useState({
    proficiency_level: 'intermediate',
    years_experience: 0,
    hourly_rate_override: null
  });

  useEffect(() => {
    loadSubjects()
    loadUserSubjects()
  }, []);

  // Load all available subjects
  const loadSubjects = async () => {
    setIsLoadingSubjects(true)
    setError(null)
    try {
      const response = await getAllSubjects()
      if (response.error) {
        throw new Error(response.error.message)
      }

      setAllSubjects((response.data || []).map(subject => ({ value: subject.name, label: subject.name, id: subject.id })))
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setError(error.message || 'Failed to load subjects')
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Load user's subjects (for tutors, load from tutor_subjects)
  const loadUserSubjects = async () => {
    if (!form.getValues('email')) return

    try {
      const result = await getTutorSubjectsByEmail(form.getValues('email'))
      if (result.data) {
        setTutorSubjects(result.data)
      }
    } catch (error) {
      console.error('Error loading user subjects:', error)
    }
  }
  // Add subject to user (for tutors, show proficiency modal)
  const handleAddSubject = async (newSubject) => {
    if (!newSubject || !form.getValues('email')) return
    setSubjectLoading(true);
    const { data, error } = await createSubject({ name: newSubject });
    if (error) {
      toast.error("Failed to create subject");
      setError(error.message || 'Failed to create subject');
    }
    setAllSubjects(prev => [...prev, { value: data.name, label: data.name, id: data.id }]);
    setSelectedSubject({ value: data.name, label: data.name, id: data.id });
    setSubjectLoading(false);
    setShowSubjectModal(true);
  }

  // Handle tutor subject addition with proficiency
  const handleTutorSubjectAdd = async () => {
    if (!selectedSubject[0] || !form.watch('email') || !form.watch('tutor.id')) return
    setIsLoadingSubjects(true)
    try {
      const result = await addTutorSubjectByEmail(
        form.getValues('tutor.id'),
        selectedSubject[0].id,
        subjectProficiency
      )
      if (result.data) {
        setTutorSubjects(prev => [...prev, result.data])
        setSelectedSubject("")
        toast.success("Subject added successfully!")
      } else {
        toast.error("Failed to add subject")
      }
    } catch (error) {
      console.error('Error adding tutor subject:', error)
      toast.error("Failed to add subject")
    } finally {
      setIsLoadingSubjects(false);
      setShowSubjectModal(false);
    }
  }

  // Handle tutor subject update
  const handleTutorSubjectUpdate = async (tutorSubjectId) => {
    console.log('Updating tutor subject:', tutorSubjectId, form.getValues('tutor.id'), subjectProficiency);
    if (!form.getValues('email')) return

    setIsLoadingSubjects(true)
    try {
      const result = await updateTutorSubjectByEmail(
        tutorSubjectId,
        subjectProficiency
      )
      if (result.data) {
        setTutorSubjects(prev => prev.map(ts =>
          ts.id === tutorSubjectId ? result.data : ts
        ))
        setShowSubjectModal(false)
        toast.success("Subject updated successfully!")
      } else {
        toast.error("Failed to update subject")
      }
    } catch (error) {
      console.error('Error updating tutor subject:', error)
      toast.error("Failed to update subject")
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  // Remove subject from user
  const handleRemoveSubject = async (subjectId) => {
    if (!form.getValues('email')) return

    try {
        const result = await removeTutorSubjectByEmail(form.getValues('tutor.id'), subjectId)
        if (!result.error) {
          setTutorSubjects(prev => prev.filter(ts => ts.subject_id !== subjectId))
          toast.success("Subject removed successfully!")
        } else {
          toast.error("Failed to remove subject")
        }
    } catch (error) {
      console.error('Error removing subject:', error)
      toast.error("Failed to remove subject")
    }
  }
  return (
    <>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Your Subjects</CardTitle>
          <CardDescription>
            Manage subjects you can teach with expertise levels and rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new subject */}
          <CreatableSelect
            isMulti
            isClearable
            placeholder={'Search subjects...'}
            allowCreateWhileLoading
            options={allSubjects}
            noOptionsMessage={() => error ? 'Error loading subjects - click reload above' : 'No Categories Found'}
            isLoading={subjectLoading}
            isDisabled={isLoadingSubjects}
            onChange={(selectedOptions) => {
              setSelectedSubject(selectedOptions);
              setShowSubjectModal(true);
            }}
            onCreateOption={handleAddSubject}
            value={selectedSubject}
          />

          {/* Display subjects */}
          <div className="space-y-4">
            {tutorSubjects.map((tutorSubject) => (
              <div
                key={tutorSubject.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{tutorSubject.subjects?.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {tutorSubject.proficiency_level}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tutorSubject.years_experience > 0 && (
                      <span>{tutorSubject.years_experience} years experience</span>
                    )}
                    {tutorSubject.hourly_rate_override && (
                      <span className="ml-2">
                        ₹{tutorSubject.hourly_rate_override}/hour
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSubjectData(tutorSubject)
                      setSubjectProficiency({
                        proficiency_level: tutorSubject.proficiency_level,
                        years_experience: tutorSubject.years_experience,
                        hourly_rate_override: tutorSubject.hourly_rate_override
                      })
                      setShowSubjectModal(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubject(tutorSubject.subject_id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {tutorSubjects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No subjects added yet. Add subjects you can teach.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Subject Proficiency Modal */}
      <Dialog open={showSubjectModal} onOpenChange={setShowSubjectModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSubjectData?.id ? 'Edit' : 'Add'} Subject Expertise
            </DialogTitle>
            <DialogDescription>
              Set your proficiency level and experience for {selectedSubjectData?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="proficiency" className="text-right">
                Proficiency
              </label>
              <Select
                value={subjectProficiency.proficiency_level}
                onValueChange={(value) => setSubjectProficiency(prev => ({ ...prev, proficiency_level: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="experience" className="text-right">
                Experience (years)
              </label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={subjectProficiency.years_experience}
                onChange={(e) => setSubjectProficiency(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rate" className="text-right">
                Custom Rate ($/hr)
              </label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional"
                value={subjectProficiency.hourly_rate_override || ''}
                onChange={(e) => setSubjectProficiency(prev => ({ ...prev, hourly_rate_override: e.target.value ? parseFloat(e.target.value) : null }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowSubjectModal(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={selectedSubjectData?.id ?
                () => handleTutorSubjectUpdate(selectedSubjectData.id) :
                handleTutorSubjectAdd
              }
              disabled={isLoadingSubjects}
            >
              {isLoadingSubjects && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedSubjectData?.id ? 'Update' : 'Add'} Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
