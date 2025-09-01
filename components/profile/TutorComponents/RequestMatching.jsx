"use client"

import { X, Plus, DollarSign, Languages, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";

export default function RequestMatching({ form }) {
    // Language management
    const [newLanguage, setNewLanguage] = useState("");
    const [newSpecialization, setNewSpecialization] = useState("");
    const [newCertification, setNewCertification] = useState("");

    const addLanguage = () => {
        if (!newLanguage.trim()) return
        const currentLanguages = form.getValues('tutor.languages') || []
        if (!currentLanguages.includes(newLanguage.trim())) {
            form.setValue('tutor.languages', [...currentLanguages, newLanguage.trim()])
            setNewLanguage("")
        }
    }

    const removeLanguage = (language) => {
        const currentLanguages = form.getValues('tutor.languages') || []
        form.setValue('tutor.languages', currentLanguages.filter(l => l !== language))
    }

    const addSpecialization = () => {
        if (!newSpecialization.trim()) return
        const currentSpecs = form.getValues('tutor.specializations') || []
        if (!currentSpecs.includes(newSpecialization.trim())) {
            form.setValue('tutor.specializations', [...currentSpecs, newSpecialization.trim()])
            setNewSpecialization("")
        }
    }

    const removeSpecialization = (spec) => {
        const currentSpecs = form.getValues('tutor.specializations') || []
        form.setValue('tutor.specializations', currentSpecs.filter(s => s !== spec))
    }

    const addCertification = () => {
        if (!newCertification.trim()) return
        const currentCerts = form.getValues('tutor.certifications') || []
        if (!currentCerts.includes(newCertification.trim())) {
            form.setValue('tutor.certifications', [...currentCerts, newCertification.trim()])
            setNewCertification("")
        }
    }

    const removeCertification = (cert) => {
        const currentCerts = form.getValues('tutor.certifications') || []
        form.setValue('tutor.certifications', currentCerts.filter(c => c !== cert))
    }

    const toggleMeetingType = (type) => {
        const currentTypes = form.getValues('tutor.preferred_meeting_types') || []
        if (currentTypes.includes(type)) {
            form.setValue('tutor.preferred_meeting_types', currentTypes.filter(t => t !== type))
        } else {
            form.setValue('tutor.preferred_meeting_types', [...currentTypes, type])
        }
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Professional Information
                    </CardTitle>
                    <CardDescription>Set your rates and professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="tutor.hourly_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hourly Rate ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tutor.experience_years"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teaching Experience (years)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="tutor.education"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Education Background</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your educational background..."
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tutor.teaching_style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teaching Style</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your teaching approach and methodology..."
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        Languages & Specializations
                    </CardTitle>
                    <CardDescription>Manage your language skills and areas of expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Languages */}
                    <div className="space-y-3">
                        <FormLabel>Languages Spoken</FormLabel>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a language"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                            />
                            <Button type="button" onClick={addLanguage} size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(form.watch('tutor.languages') || []).map((language, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {language}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeLanguage(language)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Specializations */}
                    <div className="space-y-3">
                        <FormLabel>Specializations</FormLabel>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a specialization"
                                value={newSpecialization}
                                onChange={(e) => setNewSpecialization(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                            />
                            <Button type="button" onClick={addSpecialization} size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(form.watch('tutor.specializations') || []).map((spec, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {spec}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeSpecialization(spec)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-3">
                        <FormLabel>Certifications</FormLabel>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a certification"
                                value={newCertification}
                                onChange={(e) => setNewCertification(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                            />
                            <Button type="button" onClick={addCertification} size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(form.watch('tutor.certifications') || []).map((cert, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {cert}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeCertification(cert)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Availability & Preferences
                    </CardTitle>
                    <CardDescription>Set your availability and tutoring preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="tutor.availability_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Availability Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="busy">Busy</SelectItem>
                                            <SelectItem value="away">Away</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tutor.response_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Response Time</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="< 1 hour">Within 1 hour</SelectItem>
                                            <SelectItem value="< 4 hours">Within 4 hours</SelectItem>
                                            <SelectItem value="< 12 hours">Within 12 hours</SelectItem>
                                            <SelectItem value="< 24 hours">Within 24 hours</SelectItem>
                                            <SelectItem value="1-2 days">1-2 days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="tutor.minimum_session_duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Session Duration (minutes)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="15" step="15" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tutor.travel_radius_km"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Travel Radius (km)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Meeting Types */}
                    <div className="space-y-3">
                        <FormLabel>Preferred Meeting Types</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {['online', 'in_person', 'hybrid', 'group_sessions'].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={type}
                                        checked={(form.watch('tutor.preferred_meeting_types') || []).includes(type)}
                                        onCheckedChange={() => toggleMeetingType(type)}
                                    />
                                    <label htmlFor={type} className="text-sm capitalize">
                                        {type.replace('_', ' ')}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instant Booking */}
                    <div className="flex items-center space-x-2">
                        <FormField
                            control={form.control}
                            name="tutor.instant_booking"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Enable Instant Booking
                                        </FormLabel>
                                        <FormDescription>
                                            Allow students to book sessions with you instantly
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="tutor.cancellation_policy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cancellation Policy</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your cancellation policy..."
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </>
    )
}
