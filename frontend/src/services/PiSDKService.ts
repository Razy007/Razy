export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
}

declare const Pi: any;

export class PiSDKService {
  private static instance: PiSDKService;

  private constructor() {}

  public static getInstance(): PiSDKService {
    if (!PiSDKService.instance) {
      PiSDKService.instance = new PiSDKService();
    }
    return PiSDKService.instance;
  }

  /**
   * Actual Pi SDK payment flow
   */
  async createPayment(data: PiPaymentData, callbacks: {
    onReadyForServerApproval: (paymentId: string) => void;
    onReadyForServerCompletion: (paymentId: string, txid: string) => void;
    onCancel: (paymentId: string) => void;
    onError: (error: Error, paymentId?: string) => void;
  }): Promise<void> {
    console.log('[Pi SDK] Creating real payment:', data);
    
    if (typeof Pi === 'undefined') {
      const err = new Error('Pi SDK not found');
      callbacks.onError(err);
      throw err;
    }

    try {
      return Pi.createPayment({
        amount: data.amount,
        memo: data.memo,
        metadata: data.metadata,
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('[Pi SDK] Payment ready for server approval:', paymentId);
          callbacks.onReadyForServerApproval(paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('[Pi SDK] Payment ready for server completion:', paymentId, txid);
          callbacks.onReadyForServerCompletion(paymentId, txid);
        },
        onCancel: (paymentId: string) => {
          console.log('[Pi SDK] Payment cancelled:', paymentId);
          callbacks.onCancel(paymentId);
        },
        onError: (error: Error, paymentId?: string) => {
          console.error('[Pi SDK] Payment error:', error, paymentId);
          callbacks.onError(error, paymentId);
        },
      });
    } catch (error: any) {
      console.error('[Pi SDK] Payment initiation error:', error);
      callbacks.onError(error);
    }
  }
}
