"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Coins } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { createPaymentTransaction } from "@/lib/supabaseAPI"

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
  const [selectedCoinPackage, setSelectedCoinPackage] = useState(coinPackagesWithSavings[2]) // Default to 150 coins
  const { profile, setProfile } = useUser();
  console.log("profile in WalletModal:", profile);

  const createOrderId = async () => {
    onClose();
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(selectedCoinPackage.price) * 100,
          currency: 'INR',
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const processPayment = async () => {
    try {
      const orderId = await createOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(selectedCoinPackage.price) * 100,
        currency: 'INR',
        name: 'TopTutor',
        description: 'Purchase Coins',
        order_id: orderId,
        handler: async function (response) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          });
          const res = await result.json();
          if (res.isOk) {
            setProfile(prevProfile => ({
              ...prevProfile,
              coin_balance: prevProfile.coin_balance + selectedCoinPackage.coins
            })); // Update profile with new coin balance
          }
          await createPaymentTransaction({
            user_email: profile.email,
            amount: selectedCoinPackage.price,
            coins: selectedCoinPackage.coins,
            session_id: data.razorpayPaymentId,
            metadata: {
              orderCreationId: data.orderCreationId,
              razorpayPaymentId: data.razorpayPaymentId,
              razorpayOrderId: data.razorpayOrderId,
              razorpaySignature: data.razorpaySignature,
            },
            payment_method: 'razorpay',
            status: res.isOk ? 'succeeded' : 'failed',
            created_at: new Date().toISOString(),
          }, profile);
          res.isOk ? toast.success("payment succeed") : toast.error("payment failed");
        },
        prefill: {
          name: profile.name,
          email: profile.email,
        },
        theme: {
          color: '#FFFFFF',
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    if (!profile?.email) {
      toast.error("Please login to continue")
      return
    }
    if (!selectedCoinPackage.coins) {
      toast.error("Please select a coin package")
      return
    }
    console.log("Selected package for checkout:", selectedCoinPackage.coins);
    processPayment()
  }

  const handleDropdownCheckout = async () => {
    if (!selectedCoinPackage) {
      toast.error("Please select a coin package")
      return
    }

    const packageData = coinPackagesWithSavings.find(pkg => pkg === selectedCoinPackage)
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
                    <SelectItem key={pkg.coins} value={pkg}>
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
            <li>• Secure payment processing via Razorpay</li>
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
