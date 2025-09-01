import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { languages } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AlertTriangle, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import BadgingProfiles from './BadgingProfiles';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { uploadAvatar } from '@/lib/supabaseAPI';

export default function PersonalInformation({ form }) {

    const updateProfileImage = async (file) => {
        if (!file) return;
        form.setValue('isUploadingProfileImage', true);
        try {
            form.setValue('avatar', URL.createObjectURL(file));
            await uploadAvatar(file, form.getValues("email"));
            
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            form.setValue('isUploadingProfileImage', false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            {form.watch("isUploadingProfileImage") ? (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <>
                                    <AvatarImage className='rounded-full h-24 w-24' src={form.getValues("avatar") || ""} alt="Profile" />
                                    <AvatarFallback className="bg-black text-white h-24 w-24">
                                        {form.getValues("name")
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("") || "U"}
                                    </AvatarFallback>
                                </>
                            )}
                        </Avatar>

                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Upload avatar</span>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    updateProfileImage(file);
                                }
                            }}
                        />
                    </div>
                    <BadgingProfiles rating={form.getValues("rating")} />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} readOnly className="bg-muted" />
                            </FormControl>
                            <div className="flex items-center gap-2 text-sm">
                                {form.getValues("email_verified") ? (
                                    <><CheckCircle className="h-4 w-4 text-green-500" /> Verified</>
                                ) : (
                                    <><AlertTriangle className="h-4 w-4 text-yellow-500" /> Unverified</>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PhoneInput
                                    {...field}
                                    onChange={field.onChange}
                                    value={field.value}
                                    country={'in'}
                                    enableSearch={true}
                                    placeholder="Enter phone number"
                                    countryCodeEditable={false}
                                    inputStyle={{
                                        width: '100%',
                                        height: '34px',
                                        fontSize: '16px',
                                        paddingLeft: '50px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                    }}
                                    containerStyle={{
                                        maxWidth: '28rem',
                                    }}

                                    dropdownStyle={{
                                        textAlign: 'left',
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timezone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Timezone</FormLabel>
                                <FormControl>
                                    <Input placeholder="UTC" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="preferred_language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preferred Language</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose language" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {languages.map(language => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

            </CardContent>
        </Card>
    )
}
