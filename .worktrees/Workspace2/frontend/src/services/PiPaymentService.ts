import { PaymentData } from '../types';
import { createPayment, getPaymentStatus } from './piPayments';
import { api } from './api';

export class PiPaymentService {
    private static instance: PiPaymentService;

    private constructor() {}

    public static getInstance(): PiPaymentService {
        if (!PiPaymentService.instance) {
            PiPaymentService.instance = new PiPaymentService();
        }
        return PiPaymentService.instance;
    }
    
    /**
     * Creates a new payment flow
     */
    async createPayment(amount: number, memo: string, metadata: any) {
        try {
            console.log("💰 Initiating Pi Payment:", { amount, memo });
            
            // 1. Create payment using the functional SDK wrapper
            const payment = await createPayment(amount, memo, metadata);
            
            // 2. Log transaction start to our backend for auditing
            await this.logTransactionStart(payment);
            
            return payment;
        } catch (error) {
            console.error('Payment creation failed:', error);
            throw new Error('Failed to create Pi payment');
        }
    }
    
    /**
     * Verifies payment status with backend
     */
    async verifyPayment(paymentId: string) {
        try {
            // Check status from our backend/SDK
            const payment = await getPaymentStatus(paymentId);
            
            if (payment?.status === 'completed') {
                await this.processSuccessfulPayment(payment);
            }
            
            return payment;
        } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
        }
    }
    
    private async logTransactionStart(payment: any) {
         // Secure logging to backend
         await api.post('/analytics/transaction-start', {
             paymentId: payment.identifier,
             amount: payment.amount,
             memo: payment.memo,
             timestamp: new Date().toISOString()
         });
    }
    
    private async processSuccessfulPayment(payment: any) {
        // Trigger post-payment logic (e.g. unlock course, add energy)
         await api.post('/payments/process-success', {
             paymentId: payment.identifier
         });
    }
}
