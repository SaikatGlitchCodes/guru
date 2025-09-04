"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Share2, 
  UserCheck, 
  Settings, 
  Mail, 
  Phone,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Cookie,
  Globe,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground mt-1">
              How we collect, use, and protect your personal information
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
            <Shield className="h-3 w-3" />
            GDPR Compliant
          </Badge>
        </div>

        {/* Privacy Overview */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and being transparent about how we use it. 
            This policy explains our data practices in clear, simple terms.
          </AlertDescription>
        </Alert>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collection">Data Collection</TabsTrigger>
            <TabsTrigger value="usage">How We Use Data</TabsTrigger>
            <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
            <TabsTrigger value="rights">Your Rights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Privacy at a Glance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  TopTutor connects students with tutors while protecting your privacy. Here's what you need to know:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      What We Do
                    </h4>
                    <ul className="text-sm space-y-1 text-green-600 dark:text-green-300">
                      <li>• Collect only necessary information</li>
                      <li>• Use secure encryption for data protection</li>
                      <li>• Share contact info only after payment</li>
                      <li>• Give you control over your data</li>
                      <li>• Follow Indian privacy laws</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      What We Don't Do
                    </h4>
                    <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-300">
                      <li>• Sell your personal information</li>
                      <li>• Share data with advertisers</li>
                      <li>• Store payment card details</li>
                      <li>• Track you across other websites</li>
                      <li>• Send spam or unwanted emails</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Principles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Our Privacy Principles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Security First</h4>
                    <p className="text-xs text-muted-foreground">All data is encrypted and securely stored using industry standards</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Transparency</h4>
                    <p className="text-xs text-muted-foreground">Clear information about what data we collect and why</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Your Control</h4>
                    <p className="text-xs text-muted-foreground">You can access, update, or delete your data anytime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">Account Information</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Personal Details:</strong> Name, email address, phone number</li>
                      <li>• <strong>Profile Information:</strong> Education background, subjects, experience</li>
                      <li>• <strong>Location:</strong> City, state (for matching purposes)</li>
                      <li>• <strong>Account Preferences:</strong> Notification settings, language</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-600">Usage Information</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Platform Activity:</strong> Pages visited, features used, time spent</li>
                      <li>• <strong>Communication:</strong> Messages sent through our platform</li>
                      <li>• <strong>Search History:</strong> Tutors searched, filters applied</li>
                      <li>• <strong>Connection Activity:</strong> Connections made, payments processed</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-600">Technical Information</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Device Information:</strong> Browser type, operating system</li>
                      <li>• <strong>IP Address:</strong> For security and location services</li>
                      <li>• <strong>Cookies:</strong> For platform functionality and preferences</li>
                      <li>• <strong>Log Data:</strong> Access times, error logs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600" />
                  How We Collect Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Directly From You</h4>
                    <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-300">
                      <li>• Account registration forms</li>
                      <li>• Profile creation and updates</li>
                      <li>• Contact forms and support requests</li>
                      <li>• Payment information (processed securely)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Automatically</h4>
                    <ul className="text-sm space-y-1 text-green-600 dark:text-green-300">
                      <li>• Platform usage analytics</li>
                      <li>• Browser cookies and local storage</li>
                      <li>• Server logs and error tracking</li>
                      <li>• Security monitoring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            {/* How We Use Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-600">Platform Services</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create and manage your account</li>
                      <li>• Match students with suitable tutors</li>
                      <li>• Facilitate communication between users</li>
                      <li>• Process payments securely</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">Communication</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Send important account notifications</li>
                      <li>• Respond to your inquiries and support requests</li>
                      <li>• Share platform updates and new features</li>
                      <li>• Send transaction confirmations and receipts</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-600">Platform Improvement</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Analyze usage patterns to improve features</li>
                      <li>• Monitor platform performance and security</li>
                      <li>• Conduct research for new services</li>
                      <li>• Ensure compliance with legal requirements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-orange-600" />
                  Cookies and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies to enhance your experience on our platform. You can control cookie settings through your browser.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Essential Cookies</h4>
                    <p className="text-sm text-green-600 dark:text-green-300 mb-2">Required for platform functionality</p>
                    <ul className="text-xs space-y-1 text-green-600 dark:text-green-300">
                      <li>• User authentication</li>
                      <li>• Security features</li>
                      <li>• Basic preferences</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Analytics Cookies</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">Help us improve our platform</p>
                    <ul className="text-xs space-y-1 text-blue-600 dark:text-blue-300">
                      <li>• Usage statistics</li>
                      <li>• Performance monitoring</li>
                      <li>• Error tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sharing Tab */}
          <TabsContent value="sharing" className="space-y-6">
            {/* When We Share Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-red-600" />
                  When We Share Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> We never sell your personal information to third parties. 
                    We only share data in specific circumstances outlined below.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">With Other Users</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      After successful payment for connections:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Contact information (email, phone) shared between student and tutor</li>
                      <li>• Profile information visible to connected users</li>
                      <li>• Communication history within the platform</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-600">Service Providers</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Trusted partners who help us operate our platform:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Payment processors (for secure transactions)</li>
                      <li>• Email service providers (for notifications)</li>
                      <li>• Cloud hosting services (for data storage)</li>
                      <li>• Analytics services (for platform improvement)</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-600">Legal Requirements</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      When required by law or to protect our platform:
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Response to legal requests or court orders</li>
                      <li>• Prevention of fraud or illegal activities</li>
                      <li>• Protection of user safety and platform security</li>
                      <li>• Compliance with regulatory requirements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Your Rights Tab */}
          <TabsContent value="rights" className="space-y-6">
            {/* Your Privacy Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You have the following rights regarding your personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">Access & Portability</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• View all data we have about you</li>
                      <li>• Download your information</li>
                      <li>• Get copies of your messages and activity</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-600">Update & Correct</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Edit your profile information</li>
                      <li>• Update contact details</li>
                      <li>• Correct any inaccurate data</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-600">Control & Restrict</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Limit how we use your data</li>
                      <li>• Opt out of non-essential communications</li>
                      <li>• Control cookie preferences</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-600">Delete & Object</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Delete your account and data</li>
                      <li>• Object to certain data processing</li>
                      <li>• Request data erasure</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Exercise Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  How to Exercise Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Account Settings</h4>
                    <p className="text-xs text-muted-foreground">Update most information directly in your account</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Contact Support</h4>
                    <p className="text-xs text-muted-foreground">Email us for data requests or questions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Call Us</h4>
                    <p className="text-xs text-muted-foreground">Speak directly with our privacy team</p>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Response Time:</strong> We will respond to privacy requests within 30 days. 
                    Some requests may require identity verification for security purposes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-gray-600" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We retain your data only as long as necessary for providing our services and meeting legal obligations:
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Account Information</span>
                    <span className="font-medium">Until account deletion</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Communication Records</span>
                    <span className="font-medium">3 years</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Payment Records</span>
                    <span className="font-medium">7 years (legal requirement)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Analytics Data</span>
                    <span className="font-medium">2 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Privacy Questions or Concerns?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our privacy team is here to help with any questions about how we handle your personal information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+918884058512" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Privacy Hotline: +91 88840 58512
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:toptutorcontact@gmail.com?subject=Privacy Inquiry" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  privacy@toptutor.com
                </a>
              </Button>
            </div>
            <Link href="/contact">
              <Button className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Contact Privacy Team
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
