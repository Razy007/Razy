import { AxiosInstance } from 'axios';
import * as StellarSdk from 'stellar-sdk';
import { PiNetworkConfig } from '../../config/pi-network';

interface CreatePaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  userUid: string;
}

interface PaymentDTO {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  from_address: string;
  to_address: string;
  direction: string;
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export class PiNetworkService {
  private config: PiNetworkConfig;
  private axiosClient: AxiosInstance;

  constructor() {
    this.config = PiNetworkConfig.getInstance();
    this.axiosClient = this.config.getAxiosClient();
  }

  async approvePayment(paymentId: string): Promise<void> {
    try {
      await this.axiosClient.post(`/v2/payments/${paymentId}/approve`);
      console.log(`[Pi] Payment approved (ID masked)`);
    } catch (error: any) {
      console.error('[Pi] Failed to approve payment:', error.response?.data || error.message);
      throw new Error('Failed to approve payment on Pi Network');
    }
  }

  async completePayment(paymentId: string, txid: string): Promise<void> {
    try {
      await this.axiosClient.post(`/v2/payments/${paymentId}/complete`, { txid });
      console.log(`[Pi] Payment completed (ID masked) with txid ${txid}`);
    } catch (error: any) {
      console.error('[Pi] Failed to complete payment:', error.response?.data || error.message);
      throw new Error('Failed to complete payment on Pi Network');
    }
  }

  async getPayment(paymentId: string): Promise<PaymentDTO> {
    try {
      const response = await this.axiosClient.get(`/v2/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      console.error('[Pi] Failed to get payment:', error.response?.data || error.message);
      throw new Error('Failed to retrieve payment from Pi Network');
    }
  }

  async verifyTransaction(txid: string, paymentId: string): Promise<boolean> {
    try {
      const payment = await this.getPayment(paymentId);
      
      if (!payment.transaction) {
        return false;
      }

      return payment.transaction.verified && payment.transaction.txid === txid;
    } catch (error) {
      console.error('[Pi] Failed to verify transaction:', error);
      return false;
    }
  }

  async cancelPayment(paymentId: string): Promise<void> {
    try {
      await this.axiosClient.post(`/v2/payments/${paymentId}/cancel`);
      console.log(`[Pi] Payment cancelled (ID masked)`);
    } catch (error: any) {
      console.error('[Pi] Failed to cancel payment:', error.response?.data || error.message);
      throw new Error('Failed to cancel payment on Pi Network');
    }
  }

  async getIncompletePayment(userId: string): Promise<PaymentDTO | null> {
    try {
      const response = await this.axiosClient.get(`/v2/payments/incomplete`, {
        params: { uid: userId }
      });
      return response.data || null;
    } catch (error) {
      console.error('[Pi] Failed to get incomplete payment:', error);
      return null;
    }
  }

  async createA2UPayment(data: CreatePaymentData): Promise<string> {
    try {
      const response = await this.axiosClient.post('/v2/payments', {
        payment: {
          amount: data.amount,
          memo: data.memo,
          metadata: data.metadata,
          uid: data.userUid
        }
      });

      const paymentId = response.data.identifier;
      console.log(`[Pi] A2U Payment created (ID masked)`);

      return paymentId;
    } catch (error: any) {
      console.error('[Pi] Failed to create A2U payment:', error.response?.data || error.message);
      throw new Error('Failed to create A2U payment on Pi Network');
    }
  }

  async submitA2UTransaction(
    paymentId: string,
    recipientAddress: string,
    amount: number
  ): Promise<string> {
    try {
      // @ts-ignore
      const server = new StellarSdk.Horizon.Server(this.config.blockchainURL);
      const sourceKeypair = StellarSdk.Keypair.fromSecret(this.config.walletPrivateSeed);
      
      const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
      const baseFee = await server.fetchBaseFee();
      const timebounds = await server.fetchTimebounds(180);

      try {
        await server.loadAccount(recipientAddress);
      } catch (error) {
        throw new Error('Recipient account does not exist on blockchain');
      }

      const payment = StellarSdk.Operation.payment({
        destination: recipientAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString()
      });

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: baseFee.toString(),
        networkPassphrase: this.config.networkPassphrase,
        timebounds: timebounds
      })
        .addOperation(payment)
        .addMemo(StellarSdk.Memo.text(paymentId.substring(0, 28)))
        .build();

      transaction.sign(sourceKeypair);

      const result = await server.submitTransaction(transaction);
      const txid = result.hash;

      console.log(`[Pi] Transaction submitted: ${txid}`);

      await this.completePayment(paymentId, txid);

      return txid;
    } catch (error) {
      console.error('[Pi] Failed to submit A2U transaction:', error);
      throw new Error('Failed to submit transaction to Pi Blockchain');
    }
  }
}
