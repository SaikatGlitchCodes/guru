"use client"

import { useState } from "react"
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/contexts/UserContext"
import { sendPasswordResetEmail } from "@/lib/supabaseAPI"
import { toast } from "sonner"
import GoogleAuthButton from "./GoogleAuthButton"

// Add prop to control default role
const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
})

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address")
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Please use a Gmail address for registration"
    }),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    role: z.enum(["student", "tutor"], {
        required_error: "Please select your role"
    })
})

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address")
})

export default function AuthModal({ defaultRole = "", triggerText = "Sign In / Up", background = "bg-primary" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [signInErrors, setSignInErrors] = useState({})
    const [signUpErrors, setSignUpErrors] = useState({})
    const [forgotPasswordErrors, setForgotPasswordErrors] = useState({})
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [resetEmailSent, setResetEmailSent] = useState(false)
    
    const { refreshUserData } = useUser()

    const validateSignIn = (formData) => {
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }

        const result = signInSchema.safeParse(data)
        if (!result.success) {
            const errors = {}
            result.error.errors.forEach((error) => {
                if (error.path[0]) {
                    errors[error.path[0]] = error.message
                }
            })
            setSignInErrors(errors)
            return false
        }

        setSignInErrors({})
        return true
    }

    const validateSignUp = (formData) => {
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role")
        }

        const result = signUpSchema.safeParse(data)
        if (!result.success) {
            const errors = {}
            result.error.errors.forEach((error) => {
                if (error.path[0]) {
                    errors[error.path[0]] = error.message
                }
            })
            setSignUpErrors(errors)
            return false
        }

        setSignUpErrors({})
        return true
    }

    const validateForgotPassword = (formData) => {
        const data = {
            email: formData.get("email")
        }

        const result = forgotPasswordSchema.safeParse(data)
        if (!result.success) {
            const errors = {}
            result.error.errors.forEach((error) => {
                if (error.path[0]) {
                    errors[error.path[0]] = error.message
                }
            })
            setForgotPasswordErrors(errors)
            return false
        }

        setForgotPasswordErrors({})
        return true
    }

    const handleSignIn = async (formData) => {
        if (!validateSignIn(formData)) return

        setIsLoading(true)
        try {
            const email = formData.get("email")
            const password = formData.get("password")
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            
            if (error) throw error;

            await refreshUserData()
            
            setIsOpen(false)
            setSignInErrors({})
        } catch (error) {
            setSignInErrors({ email: "Invalid email or password" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (formData) => {
        if (!validateSignUp(formData)) return

        const email = formData.get("email")
        const password = formData.get("password")
        const name = formData.get("name")
        const role = formData.get("role")

        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })
            
            if (error) throw error;
            
            await supabase
                .from('users')
                .insert([
                    {
                        email,
                        name,
                        role,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ])
            .single()

            if (data.session) {
                await refreshUserData()
            }

            if (data.user && data.session === null) {
                toast.success("Account created successfully! Please check your email to verify your account before signing in.")
            }

            setIsOpen(false)
            setSignUpErrors({})
        } catch (error) {
            if (error.message?.includes('User already registered')) {
                setSignUpErrors({ email: "An account with this email already exists. Try signing in instead." })
            } else {
                setSignUpErrors({ email: error.message || "An error occurred while creating your account" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (formData) => {
        if (!validateForgotPassword(formData)) return

        setIsLoading(true)
        try {
            const email = formData.get("email")
            
            const result = await sendPasswordResetEmail(email)
            
            if (result.error) throw result.error

            setResetEmailSent(true)
            toast.success("Password reset email sent! Please check your inbox and follow the instructions.")
        } catch (error) {
            if (error.message?.includes('User not found')) {
                setForgotPasswordErrors({ email: "No account found with this email address" })
            } else {
                setForgotPasswordErrors({ email: error.message || "Failed to send reset email. Please try again." })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const clearErrors = () => {
        setSignInErrors({})
        setSignUpErrors({})
        setForgotPasswordErrors({})
        setShowForgotPassword(false)
        setResetEmailSent(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) clearErrors()
        }}>
            <DialogTrigger asChild>
                <Button className={`px-4 ${background}`}>{triggerText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {showForgotPassword ? "Reset Password" : "Welcome"}
                    </DialogTitle>
                    <DialogDescription>
                        {showForgotPassword 
                            ? "Enter your email address to receive a password reset link."
                            : "Sign in to your account or create a new one to get started."
                        }
                    </DialogDescription>
                </DialogHeader>

                {showForgotPassword ? (
                    // Forgot Password Form
                    <div className="space-y-4 mt-6">
                        {resetEmailSent ? (
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Check your email</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We've sent a password reset link to your email address. 
                                        Click the link in the email to reset your password.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForgotPassword(false)
                                        setResetEmailSent(false)
                                    }}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Button>
                            </div>
                        ) : (
                            <form action={handleForgotPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="forgot-email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="forgot-email"
                                            name="email"
                                            type="email"
                                            className={`pl-10 ${forgotPasswordErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            required
                                        />
                                    </div>
                                    {forgotPasswordErrors.email && (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{forgotPasswordErrors.email}</span>
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setShowForgotPassword(false)}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Button>
                            </form>
                        )}
                    </div>
                ) : (
                    // Sign In / Sign Up Tabs
                    <Tabs defaultValue="signin" className="w-full" onValueChange={clearErrors}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin" className="space-y-4 mt-6">
                                <GoogleAuthButton />
                                <p className="text-sm text-muted-foreground">Promoting hassle-free signing in, with social login.</p>
                                <p className="text-sm text-muted-foreground">Users can directly create student account here, inorder to create tutor profile sign-up using gmail.</p>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4 mt-6">
                            
                            <form action={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            name="name"
                                            placeholder="Full Name"
                                            type="text"
                                            className={`pl-10 ${signUpErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            required
                                        />
                                    </div>
                                    {signUpErrors.name && (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{signUpErrors.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className={`pl-10 ${signUpErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        We'll send a verification email to this address.
                                    </p>
                                    {signUpErrors.email && (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{signUpErrors.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className={`pl-10 pr-10 ${signUpErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                    {signUpErrors.password && (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{signUpErrors.password}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>I am a</Label>
                                    <RadioGroup name="role" defaultValue={defaultRole} className="grid grid-cols-2 gap-4">
                                        <Label
                                            htmlFor="student"
                                            className="flex items-center justify-center rounded-md border-2 border-muted bg-background p-3 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white cursor-pointer"
                                        >
                                            <RadioGroupItem
                                                value="student"
                                                id="student"
                                                className="sr-only"
                                            />
                                            <User className="mr-2 h-4 w-4" />
                                            <span className="font-medium">Student</span>
                                        </Label>

                                        <Label
                                            htmlFor="tutor"
                                            className="flex items-center justify-center rounded-md border-2 border-muted bg-background p-3 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white cursor-pointer"
                                        >
                                            <RadioGroupItem
                                                value="tutor"
                                                id="tutor"
                                                className="sr-only"
                                            />
                                            <User className="mr-2 h-4 w-4" />
                                            <span className="font-medium">Tutor</span>
                                        </Label>
                                    </RadioGroup>
                                    {signUpErrors.role && (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{signUpErrors.role}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    By creating an account, you agree to our{" "}
                                    <Button variant="link" className="px-0 text-sm h-auto">
                                        Terms of Service
                                    </Button>{" "}
                                    and{" "}
                                    <Button variant="link" className="px-0 text-sm h-auto">
                                        Privacy Policy
                                    </Button>
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Create Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}
