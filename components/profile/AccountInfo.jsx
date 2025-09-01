import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Coins } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { WalletModal } from '../WalletModal';
import { toast } from 'sonner';

export default function AccountInfo({ form }) {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const handleCoinPurchaseSuccess = async (coins) => {
        form.setValue('coin_balance', (form.watch('coin_balance') || 0) + coins)
        toast.success(`${coins} coins added to your wallet!`)
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View your account status and balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                                    <span className="text-xs font-bold text-yellow-900">$</span>
                                </div>
                                <p className="text-2xl font-bold">{form.watch('coin_balance') || 0}</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsWalletModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Coins className="h-4 w-4" />
                                Buy Coins
                            </Button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span>Profile Completion</span>
                            <span>{form.watch('profile_completion_percentage') || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${form.watch('profile_completion_percentage') || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <Separator />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Status</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="ban">Banned</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                onSuccess={handleCoinPurchaseSuccess}
            />
        </>
    )
}
