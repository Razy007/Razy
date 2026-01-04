import type { PaymentData, PaymentResult } from '../types';
import { isMockMode } from './piNetwork';

/**
 * Create a payment with Pi Network
 * Falls back to mock payment if SDK is not available
 */
export const createPayment = async (
    amount: number,
    memo: string,
    metadata: any = {}
): Promise<PaymentResult> => {
    if (isMockMode()) {
        return mockCreatePayment(amount, memo, metadata);
    }

    try {
        const paymentData: PaymentData = {
            amount,
            memo,
            metadata: {
                productId: metadata.productId || 'unknown',
                ...metadata,
            },
        };

        // @ts-ignore - Pi SDK types
        const payment = await window.Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId: string) => {
                console.log('💳 Payment ready for approval:', paymentId);
                approvePaymentOnBackend(paymentId);
            },
            onReadyForServerCompletion: (paymentId: string, txid: string) => {
                console.log('✅ Payment ready for completion:', paymentId, txid);
                completePaymentOnBackend(paymentId, txid);
            },
            onCancel: (paymentId: string) => {
                console.log('❌ Payment cancelled:', paymentId);
            },
            onError: (error: any, payment: any) => {
                console.error('❌ Payment error:', error, payment);
            },
        });

        return payment as PaymentResult;
    } catch (error) {
        console.error('❌ Create payment failed:', error);
        throw error;
    }
};

/**
 * Mock payment creation for development
 */
const mockCreatePayment = async (
    amount: number,
    memo: string,
    metadata: any
): Promise<PaymentResult> => {
    console.log('🔧 Mock payment created:', { amount, memo, metadata });

    // Simulate async payment
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        identifier: 'mock_payment_' + Date.now(),
        status: 'completed',
        amount,
        memo,
        metadata,
        transaction: {
            txid: 'mock_tx_' + Math.random().toString(36).substring(7),
            verified: true,
        },
    };
};

/**
 * Approve payment on backend
 * This should call your backend API to approve the payment
 */
/**
 * Approve payment on backend
 * This should call your backend API to approve the payment
 */
export const approvePaymentOnBackend = async (paymentId: string): Promise<void> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // Get token from storage
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${apiUrl}/api/payments/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ paymentId }),
        });

        if (!response.ok) {
            throw new Error('Failed to approve payment on backend');
        }

        const data = await response.json();
        console.log('✅ Payment approved on backend:', data);
    } catch (error) {
        console.error('❌ Failed to approve payment on backend:', error);
        // In mock mode, this is expected to fail
        if (!isMockMode()) {
            throw error;
        }
    }
};

/**
 * Complete payment on backend
 * This should call your backend API to complete the payment
 */
export const completePaymentOnBackend = async (
    paymentId: string,
    txid: string
): Promise<void> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // Get token from storage
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${apiUrl}/api/payments/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ paymentId, txid }),
        });

        if (!response.ok) {
            throw new Error('Failed to complete payment on backend');
        }

        const data = await response.json();
        console.log('✅ Payment completed on backend:', data);
    } catch (error) {
        console.error('❌ Failed to complete payment on backend:', error);
        // In mock mode, this is expected to fail
        if (!isMockMode()) {
            throw error;
        }
    }
};

/**
 * Handle incomplete payment found during init
 */
export const handleIncompletePayment = async (payment: any): Promise<void> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const token = localStorage.getItem('token');

    try {
        // If payment has txid, it means user signed it, we must try to complete
        if (payment.transaction && payment.transaction.txid) {
             const response = await fetch(`${apiUrl}/api/payments/incomplete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    paymentId: payment.identifier, 
                    txid: payment.transaction.txid 
                }),
            });

            const data = await response.json();
            console.log('🔄 Incomplete payment handled:', data);
        } else {
            console.warn('⚠️ Incomplete payment found but no TXID. User might have cancelled.', payment);
            // Optionally cancel it on Pi server if needed, via backend
        }
    } catch (error) {
        console.error('❌ Handle incomplete payment failed:', error);
    }
};

/**
 * Get payment status
 * Useful for checking incomplete payments
 */
export const getPaymentStatus = async (paymentId: string): Promise<PaymentResult | null> => {
    if (isMockMode()) {
        console.log('🔧 Mock mode: Cannot get real payment status');
        return null;
    }

    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/payments/${paymentId}`);

        if (!response.ok) {
            throw new Error('Failed to get payment status');
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Failed to get payment status:', error);
        return null;
    }
};
