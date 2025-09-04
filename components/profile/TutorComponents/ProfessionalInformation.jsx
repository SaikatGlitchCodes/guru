"use client"

import { IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ProfessionalInformation({ form }) {
    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
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
                                <FormLabel>Hourly Rate (₹) *</FormLabel>
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
    )
}
