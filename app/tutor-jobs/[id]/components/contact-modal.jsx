"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle,
  User,
  Mail,
  Phone,
  MessageCircle,
  Shield,
  Copy,
  AlertTriangle
} from "lucide-react"
import { calculateContactCost } from "@/lib/contactPricing"

export default function ContactModal({ 
  isOpen, 
  onOpenChange, 
  request, 
  onCopyToClipboard, 
  onOpenEmail, 
  onOpenWhatsApp 
}) {
  if (!request) return null

  const contactCost = calculateContactCost(request)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Student Contact Details
          </DialogTitle>
          <DialogDescription>
            {request.hasAlreadyPaid 
              ? "Here are the contact details you've already purchased."
              : "You can now contact the student directly using the information below."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Student Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Student Information
            </h4>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Name:</strong> {request.student_name || 'Student Name'}
              </p>
              <p className="text-gray-700">
                <strong>Request:</strong> {request.title}
              </p>
              <p className="text-gray-700">
                <strong>Budget:</strong> {request.price_currency_symbol}{request.price_amount} per {request.price_option || 'hour'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          {request.contactInfoAvailable && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={onOpenEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button
                onClick={onOpenWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          )}

          {/* Contact Methods */}
          <div className="space-y-4">
            {/* Email */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Email</span>
                  {request.contactInfoAvailable && (
                    <Shield className="w-4 h-4 text-green-500" title="Verified Contact" />
                  )}
                </div>
                {request.contactInfoAvailable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyToClipboard(request.student_email || '', 'Email')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className={`font-mono text-sm p-3 rounded border ${
                request.contactInfoAvailable 
                  ? 'text-gray-700 bg-gray-50 border-gray-200 select-all' 
                  : 'text-orange-600 bg-orange-50 border-orange-200'
              }`}>
                {request.student_email || 'Contact details available after payment'}
              </p>
              {!request.contactInfoAvailable && (
                <div className="mt-2 text-sm text-orange-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Pay {contactCost} coins to unlock contact details
                </div>
              )}
            </div>

            {/* Phone/WhatsApp */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="font-medium">WhatsApp / Phone</span>
                  {request.contactInfoAvailable && request.phone_verified && (
                    <CheckCircle className="w-4 h-4 text-green-500" title="Verified Phone" />
                  )}
                  {request.contactInfoAvailable && (
                    <Shield className="w-4 h-4 text-green-500" title="Verified Contact" />
                  )}
                </div>
                {request.contactInfoAvailable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyToClipboard(request.student_phone || '', 'Phone number')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className={`font-mono text-sm p-3 rounded border ${
                request.contactInfoAvailable 
                  ? 'text-gray-700 bg-gray-50 border-gray-200 select-all' 
                  : 'text-orange-600 bg-orange-50 border-orange-200'
              }`}>
                {request.student_phone || 'Contact details available after payment'}
              </p>
              {!request.contactInfoAvailable && (
                <div className="mt-2 text-sm text-orange-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Pay {contactCost} coins to unlock contact details
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {!request.hasAlreadyPaid && request.contactInfoAvailable && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Payment Successful!</span>
              </div>
              <p className="text-green-600 text-sm mb-3">
                {contactCost} coins have been deducted. Good luck with your application!
              </p>
              <div className="bg-green-100 rounded p-3 text-sm text-green-800">
                <strong>Next Steps:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Reach out to the student within 24 hours</li>
                  <li>Be professional and highlight your expertise</li>
                  <li>Discuss scheduling and expectations</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
