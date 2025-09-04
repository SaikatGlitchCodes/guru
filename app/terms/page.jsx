"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  Scale,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TermsAndConditionsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions</h1>
            <p className="text-muted-foreground mt-1">
              Please read these terms carefully before using TopTutor
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div className="flex items-center gap-4 mb-8">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last Updated: September 4, 2025
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Version 1.0
          </Badge>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  By accessing and using the TopTutor platform, you accept and agree to be bound by these terms and conditions.
                </p>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You must be at least 18 years old or have parental consent to use this platform.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Our Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  TopTutor connects students with qualified tutors for educational services.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">For Students</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Find qualified tutors</li>
                      <li>• Submit tutoring requests</li>
                      <li>• Secure communication</li>
                      <li>• Safe payment processing</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-600">For Tutors</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create detailed profiles</li>
                      <li>• Browse student requests</li>
                      <li>• Direct communication</li>
                      <li>• Secure payment receipt</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* User Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  User Accounts & Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Account Registration</h4>
                  <p className="text-muted-foreground text-sm">
                    You must provide accurate, current, and complete information during registration. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Prohibited Activities</h4>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      The following activities are strictly prohibited and may result in account termination.
                    </AlertDescription>
                  </Alert>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <li>• Providing false or misleading information</li>
                    <li>• Circumventing the platform for direct payments</li>
                    <li>• Harassment or inappropriate behavior</li>
                    <li>• Sharing contact information before connection approval</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Using the platform for illegal activities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Privacy & Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We take your privacy seriously. Personal information is protected and used only for platform functionality.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Data We Collect</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Profile information (name, education, subjects)</li>
                    <li>• Contact details (email, phone number)</li>
                    <li>• Communication logs and messages</li>
                    <li>• Payment and transaction records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payments & Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Payment Terms</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• All payments processed securely</li>
                      <li>• Students pay to connect with tutors</li>
                      <li>• Connection fees are non-refundable</li>
                      <li>• Prices displayed in Indian Rupees (₹)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Platform Fees</h4>
                    <ul className="space-y-1 text-sm text-green-600 dark:text-green-300">
                      <li>• Connection fees vary by tutor</li>
                      <li>• No hidden charges</li>
                      <li>• Secure payment processing</li>
                      <li>• Digital receipts provided</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Tutoring fees and schedules are arranged directly between students and tutors. 
                    TopTutor only facilitates the initial connection.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Tab */}
          <TabsContent value="legal" className="space-y-6">
            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Disclaimers & Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important Disclaimers</strong>
                  </AlertDescription>
                </Alert>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• TopTutor is a platform facilitator, not a tutoring service provider</li>
                  <li>• We do not guarantee the quality or outcome of tutoring sessions</li>
                  <li>• Users interact with tutors at their own discretion and risk</li>
                  <li>• We are not liable for disputes between students and tutors</li>
                  <li>• Platform availability may be subject to maintenance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Governing Law & Jurisdiction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  These terms and conditions are governed by the laws of India. Any disputes arising from 
                  the use of this platform shall be subject to the jurisdiction of Indian courts.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The TopTutor platform, including its design, functionality, and content, is protected by 
                  intellectual property laws. Users retain rights to their own content but grant us license 
                  to use it for platform operations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Questions About These Terms?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+918884058512" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 88840 58512
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:toptutorcontact@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  toptutorcontact@gmail.com
                </a>
              </Button>
            </div>
            <Link href="/contact">
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Us
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
