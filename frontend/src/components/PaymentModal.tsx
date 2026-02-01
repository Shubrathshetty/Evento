
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    amount: number;
    eventName: string;
}

const PaymentModal = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    eventName,
}: PaymentModalProps) => {
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Complete Registration</DialogTitle>
                    <DialogDescription>
                        Enter your payment details to register for <span className="font-semibold text-black">{eventName}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handlePayment} className="space-y-4 py-4">
                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mb-4">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="text-2xl font-bold text-event-purple">${amount}</span>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="card">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="card"
                                placeholder="0000 0000 0000 0000"
                                className="pl-10"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                <Input
                                    id="cvc"
                                    placeholder="123"
                                    className="pl-8"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-event-purple hover:bg-event-dark-purple" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay $${amount}`
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
