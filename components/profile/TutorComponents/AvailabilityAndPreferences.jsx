"use client"

import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function AvailabilityAndPreferences({ form }) {
    const toggleMeetingType = (type) => {
        const currentTypes = form.getValues('tutor.preferred_meeting_types') || []
        if (currentTypes.includes(type)) {
            form.setValue('tutor.preferred_meeting_types', currentTypes.filter(t => t !== type))
        } else {
            form.setValue('tutor.preferred_meeting_types', [...currentTypes, type])
        }
    }

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Availability & Preferences
                </CardTitle>
                <CardDescription>Set your availability and tutoring preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
    )
}
