import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

export default function ProfileDetails({form}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Share information about yourself with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={form.watch('role') === 'tutor'
                                        ? "Tell students about your teaching philosophy and expertise..."
                                        : "Tell tutors about your learning goals and interests..."
                                    }
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                {form.watch('role') === 'tutor'
                                    ? "Describe your teaching style and what makes you unique as a tutor."
                                    : "Describe what you're looking to learn and your academic goals."
                                }
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="years_of_experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {form.watch('role') === 'tutor' ? 'Years of Teaching Experience' : 'Years of Learning Experience'}
                            </FormLabel>
                            <FormControl>
                                <Input type="number" min="0" step="0.1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="hobbies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hobbies & Interests</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Share your hobbies and interests..."
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
