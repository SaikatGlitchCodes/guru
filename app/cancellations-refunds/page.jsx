"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  RefreshCw, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ExternalLink,
  IndianRupee,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CancellationsRefundsPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Cancellations & Refunds</h1>
            <p className="text-muted-foreground mt-1">
              Our policy for cancellations, refunds, and payment disputes
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
            <RefreshCw className="h-3 w-3" />
            Version 1.0
          </Badge>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="cancellations">Cancellations</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Policy Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Policy Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  TopTutor facilitates connections between students and tutors. Our refund policy is designed to be fair while protecting both parties.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Refundable
                    </h4>
                    <ul className="text-sm space-y-1 text-green-600 dark:text-green-300">
                      <li>• Connection fees if tutor doesn't respond within 24 hours</li>
                      <li>• Fees if tutor profile information is misleading</li>
                      <li>• Technical issues preventing service delivery</li>
                      <li>• Duplicate payments made in error</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Non-Refundable
                    </h4>
                    <ul className="text-sm space-y-1 text-red-600 dark:text-red-300">
                      <li>• Connection fees after successful contact exchange</li>
                      <li>• Tutoring session fees (arranged directly)</li>
                      <li>• Change of mind after connection</li>
                      <li>• Fees older than 30 days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> TopTutor only facilitates initial connections. 
                Tutoring fees, schedules, and session-related refunds are handled directly between students and tutors.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Refunds Tab */}
          <TabsContent value="refunds" className="space-y-6">
            {/* Refund Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  Refund Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-600">✓ Eligible for Full Refund</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>Tutor Non-Response:</strong> If tutor doesn't respond within 24 hours of connection payment</li>
                      <li>• <strong>Misleading Information:</strong> If tutor's profile contains false qualifications or availability</li>
                      <li>• <strong>Technical Issues:</strong> Platform errors preventing contact information delivery</li>
                      <li>• <strong>Duplicate Payments:</strong> Accidental multiple payments for same connection</li>
                      <li>• <strong>Unauthorized Transactions:</strong> Payments made without user consent</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-600">⚠️ Partial Refund (50%)</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>Delayed Response:</strong> Tutor responds after 24 hours but within 48 hours</li>
                      <li>• <strong>Limited Availability:</strong> Tutor has significantly less availability than advertised</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-600">✗ No Refund</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>Successful Connection:</strong> Contact information successfully exchanged</li>
                      <li>• <strong>Student Preference:</strong> Change of mind after successful connection</li>
                      <li>• <strong>Session Disputes:</strong> Issues arising from direct tutoring sessions</li>
                      <li>• <strong>Time Limit:</strong> Refund requests made after 30 days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Refund Process & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <h4 className="font-semibold mb-1">Submit Request</h4>
                    <p className="text-xs text-muted-foreground">Contact us within 30 days with transaction details</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-semibold">2</span>
                    </div>
                    <h4 className="font-semibold mb-1">Review Process</h4>
                    <p className="text-xs text-muted-foreground">We review your case within 2-3 business days</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-semibold">3</span>
                    </div>
                    <h4 className="font-semibold mb-1">Refund Issued</h4>
                    <p className="text-xs text-muted-foreground">Approved refunds processed within 5-7 business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancellations Tab */}
          <TabsContent value="cancellations" className="space-y-6">
            {/* Connection Cancellations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Connection Cancellations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Once a connection payment is made and contact information is shared, 
                    the connection cannot be cancelled. However, you may be eligible for a refund under specific conditions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Before Payment</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      You can cancel your connection request at any time before making payment. No charges apply.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">After Payment</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Cancellations are not possible once payment is processed. Instead, you may request a refund if eligible conditions are met.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Cancellations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Tutoring Session Cancellations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tutoring session cancellations and related policies are managed directly between students and tutors. 
                  TopTutor does not handle session-level cancellations.
                </p>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Recommended Practices</h4>
                  <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-300">
                    <li>• Discuss cancellation policies with your tutor upfront</li>
                    <li>• Establish clear notice periods for cancellations</li>
                    <li>• Agree on refund terms for prepaid sessions</li>
                    <li>• Maintain written records of agreements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            {/* Dispute Resolution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Dispute Resolution Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you have a dispute regarding charges or refunds, we're here to help resolve it fairly and promptly.
                </p>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Step 1: Direct Contact</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team with detailed information about your dispute. 
                      Include transaction ID, dates, and supporting evidence.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Step 2: Investigation</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll investigate your case, review transaction records, and may contact the tutor for additional information.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Step 3: Resolution</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll provide a resolution within 5-7 business days. This may include refunds, credits, or alternative solutions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  How to Contact Us for Disputes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For refund requests or disputes, please provide the following information:
                </p>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-400">Required Information</h4>
                  <ul className="text-sm space-y-1 text-yellow-600 dark:text-yellow-300">
                    <li>• Transaction ID or payment reference</li>
                    <li>• Date and amount of payment</li>
                    <li>• Tutor name and profile details</li>
                    <li>• Detailed description of the issue</li>
                    <li>• Supporting evidence (screenshots, emails)</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Need Help with Refunds or Cancellations?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any refund or cancellation questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+918884058512" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Us: +91 88840 58512
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:toptutorcontact@gmail.com?subject=Refund Request" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Support
                </a>
              </Button>
            </div>
            <Link href="/contact">
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Form
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
