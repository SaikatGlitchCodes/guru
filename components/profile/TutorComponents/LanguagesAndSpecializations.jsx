"use client"

import { useState } from "react";
import { X, Plus, Languages } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function LanguagesAndSpecializations({ form }) {
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
        console.log("Removing language:", language)
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

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Languages & Specializations
                </CardTitle>
                <CardDescription>Manage your language skills and areas of expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                                <button onClick={() => console.log("Removing language:", language)}>
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeLanguage(language)}
                                    />
                                </button>

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
    )
}
