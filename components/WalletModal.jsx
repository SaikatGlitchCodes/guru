"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Coins } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51JuieFSBsceWQO10NrIXjHlkSt0IGLHgALhWXfZouPSrSTEw6uls0TPU7uCJhDiTIIZJyQ8lS0Inx8VFhTZTpofg00KXIYgAOo")

const coinPackages = [
  { coins: 50, price: 80, popular: false }, // ₹80
  { coins: 80, price: 100, popular: false }, // ₹100
  { coins: 100, price: 140, popular: true }, // ₹140
  { coins: 150, price: 200, popular: false }, // ₹560
  { coins: 200, price: 260, popular: false }, // ₹720
  { coins: 500, price: 580, popular: true }, // ₹1600
  { coins: 1000, price: 1050, popular: false }, // ₹2600
  { coins: 2000, price: 2030, popular: true }, // ₹5600
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
    console.log(`Starting checkout for ${packageData.coins} coins at ₹${packageData.price}`)
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
          amount: Math.round(packageData.price * 100), // INR in paise (100 paise = 1 INR)
          coins: packageData.coins,
          currency: 'inr',
          userEmail: user.email,
        }),
      })

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session'
        try {
          // Clone response to avoid "body stream already read" error
          const responseClone = response.clone()
          const errorData = await responseClone.json()
          errorMessage = errorData.error || errorMessage
          if (errorData.details) {
            console.error('API Error Details:', errorData.details)
          }
        } catch (jsonError) {
          // If we can't parse as JSON, try as text
          try {
            const textResponse = await response.text()
            console.error('Non-JSON error response:', textResponse)
            errorMessage = `Server error (${response.status}): Please check your configuration`
          } catch (textError) {
            console.error('Failed to read error response:', textError)
            errorMessage = `Server error (${response.status}): Unable to read error details`
          }
        }
        throw new Error(errorMessage)
      }

      const { url } = await response.json()
      
      if (url) {
        // Redirect to Stripe Checkout
        console.log('Redirecting to Stripe checkout:', url)
        window.location.href = url
      } else {
        throw new Error('No checkout URL received from server')
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
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 sm:min-w-[300px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Coin Package
              </label>
              <Select value={selectedCoinPackage} onValueChange={setSelectedCoinPackage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose coin amount" />
                </SelectTrigger>
                <SelectContent>
                  {coinPackagesWithSavings.map((pkg) => (
                    <SelectItem key={pkg.coins} value={pkg.coins.toString()}>
                      <div className="flex justify-between items-center w-full min-w-[150px]">
                        <span>{pkg.coins} coins</span>
                        <span className="font-semibold text-green-600">₹{pkg.price}</span>
                      </div>
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
              className="px-8 py-2 sm:flex-shrink-0"
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
            <li>• <strong>Multiple payment options:</strong> Credit/Debit Cards, UPI, Net Banking, and more</li>
            <li>• Local payment methods automatically available based on your location</li>
            <li>• Coins are added to your account immediately after payment</li>
            <li>• All transactions are encrypted and secure</li>
            <li>• Coins never expire and can be used for any premium features</li>
            <li>• All prices are in Indian Rupees (₹)</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
