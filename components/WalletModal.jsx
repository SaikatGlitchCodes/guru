"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Coins } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51JuieFSBsceWQO10NrIXjHlkSt0IGLHgALhWXfZouPSrSTEw6uls0TPU7uCJhDiTIIZJyQ8lS0Inx8VFhTZTpofg00KXIYgAOo")

const coinPackages = [
  { coins: 50, price: 5, popular: false },
  { coins: 80, price: 8, popular: false },
  { coins: 100, price: 10, popular: true },
  { coins: 150, price: 14, popular: false },
  { coins: 200, price: 18, popular: false },
  { coins: 500, price: 40, popular: true },
  { coins: 1000, price: 75, popular: false },
  { coins: 2000, price: 140, popular: true },
]

// Calculate base price per coin (using smallest package as baseline)
const basePricePerCoin = coinPackages[0].price / coinPackages[0].coins // $0.1 per coin

// Add savings percentage to each package
const coinPackagesWithSavings = coinPackages.map(pkg => {
  const currentPricePerCoin = pkg.price / pkg.coins
  const savingsPercentage = Math.round(((basePricePerCoin - currentPricePerCoin) / basePricePerCoin) * 100)
  return {
    ...pkg,
    pricePerCoin: currentPricePerCoin,
    savingsPercentage: savingsPercentage > 0 ? savingsPercentage : 0
  }
})

export function WalletModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedCoinPackage, setSelectedCoinPackage] = useState("")
  const { user } = useUser()

  const handlePurchase = async (packageData) => {
    setIsLoading(true)
    setSelectedPackage(packageData)

    try {
      // Create payment intent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: packageData.price * 100, // Convert to cents
          currency: 'usd',
          coins: packageData.coins,
          description: `Purchase ${packageData.coins} coins`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()

      // Get Stripe instance
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // This would typically use Stripe Elements
            // For now, we'll redirect to Stripe Checkout
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success(`Successfully purchased ${packageData.coins} coins!`)
        onSuccess?.(packageData.coins)
        onClose()
      }

    } catch (error) {
      console.error('Payment error:', error)
      toast.error(`Payment failed: ${error.message}`)
    } finally {
      setIsLoading(false)
      setSelectedPackage(null)
    }
  }

  const handleCheckout = async (packageData) => {
    if (!user?.email) {
      toast.error("Please sign in to purchase coins")
      return
    }

    setIsLoading(true)
    setSelectedPackage(packageData)

    try {
      // Create Stripe Checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: packageData.price * 100,
          coins: packageData.coins,
          currency: 'usd',
          userEmail: user.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(`Checkout failed: ${error.message}`)
      setIsLoading(false)
      setSelectedPackage(null)
    }
  }

  const handleDropdownCheckout = async () => {
    if (!selectedCoinPackage) {
      toast.error("Please select a coin package")
      return
    }

    const packageData = coinPackagesWithSavings.find(pkg => pkg.coins.toString() === selectedCoinPackage)
    if (packageData) {
      await handleCheckout(packageData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            Buy Coins
          </DialogTitle>
          <DialogDescription>
            Choose a coin package to add to your wallet. Coins can be used for premium features and services.
          </DialogDescription>
        </DialogHeader>

        {/* Dropdown Selection */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Purchase</h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Coin Package
              </label>
              <Select value={selectedCoinPackage} onValueChange={setSelectedCoinPackage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose coin amount" />
                </SelectTrigger>
                <SelectContent>
                  {coinPackagesWithSavings.map((pkg) => (
                    <SelectItem key={pkg.coins} value={pkg.coins.toString()}>
                      {pkg.coins} coins
                      {pkg.savingsPercentage > 0 && (
                        <span className="text-green-600 ml-1">({pkg.savingsPercentage}% off)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleDropdownCheckout}
              disabled={isLoading || !selectedCoinPackage}
              className="px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </Button>
          </div>
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Payment Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Secure payment processing via Stripe</li>
            <li>• Coins are added to your account immediately after payment</li>
            <li>• All transactions are encrypted and secure</li>
            <li>• Coins never expire and can be used for any premium features</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
