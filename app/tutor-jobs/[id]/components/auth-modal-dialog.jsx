"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import AuthModal from "@/components/auth-modal"

export default function AuthModalDialog({ 
  isOpen, 
  onOpenChange 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <User className="w-6 h-6 text-blue-500" />
            Sign In Required
          </DialogTitle>
          <DialogDescription>
            Please sign in or create an account to contact students and access pricing details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 py-4">
          <AuthModal 
            defaultRole="tutor" 
            triggerText="Sign In / Create Account"
          />
          
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
