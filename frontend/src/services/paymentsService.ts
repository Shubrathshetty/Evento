
import { api } from "@/lib/api";

export interface PaymentRequest {
    event_id: string;
    amount: number;
    currency?: string;
    payment_method_id: string;
}

export interface PaymentResponse {
    id: string;
    status: string;
    amount: number;
    currency: string;
    transaction_date: string;
}

export const paymentsService = {
    async processPayment(data: PaymentRequest): Promise<PaymentResponse> {
        const response = await api.post<PaymentResponse>("/api/payments/process", data);
        return response;
    }
};
