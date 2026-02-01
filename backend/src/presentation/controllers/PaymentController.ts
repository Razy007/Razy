import { Request, Response } from 'express';
import { PaymentRepository } from '../../infrastructure/repositories/PaymentRepository';
import { PiNetworkService } from '../../infrastructure/services/PiNetworkService';
import { Payment, PaymentStatus } from '../../domain/entities/Payment';

import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import Database from '../../config/database'; // Needed for Lazy Migration
// I will hardcode item logic or create shared data if possible.
// For now, I'll just check IDs strings.

export class PaymentController {
  constructor(
    private paymentRepository: PaymentRepository,
    private piNetworkService: PiNetworkService,
    private userRepository: UserRepository
  ) {}

  approvePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.body;
      const userId = (req as any).user.id;

      let payment = await this.paymentRepository.findByPiPaymentId(paymentId);
      
      if (!payment) {
        const piPayment = await this.piNetworkService.getPayment(paymentId);
        
        payment = Payment.createUserToApp({
          userId: userId,
          amount: piPayment.amount,
          memo: piPayment.memo,
          metadata: piPayment.metadata
        });
        
        payment = await this.paymentRepository.save(payment);
      }

      await this.piNetworkService.approvePayment(paymentId);

      await this.paymentRepository.updateStatus(
        payment.id,
        PaymentStatus.APPROVED
      );

      res.json({ success: true, paymentId });
    } catch (error) {
      console.error('[PaymentController] Approve failed:', error);
      res.status(500).json({ error: 'Failed to approve payment' });
    }
  };

  completePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId, txid } = req.body;

      const payment = await this.paymentRepository.findByPiPaymentId(paymentId);
      
      if (!payment) {
        res.status(404).json({ error: 'Payment not found' });
        return;
      }
      
      // Verify transaction with Pi Network
      const isValid = await this.piNetworkService.verifyTransaction(txid, paymentId);
      
      if (!isValid) {
         // Should we fail?
         // For now, allow loosely if strict verification fails but payment exists
         console.warn(`[PaymentController] Transaction verification returned false for ${txid}`);
         // res.status(400).json({ error: 'Transaction verification failed' });
         // return;
         // RESTORING EXACT LOGIC:
      }
       
      // Re-implementing strict check as per original file
      if (!isValid) { 
        res.status(400).json({ error: 'Transaction verification failed' });
        return;
      }

      await this.piNetworkService.completePayment(paymentId, txid);

      await this.paymentRepository.updateStatus(
        payment.id,
        PaymentStatus.COMPLETED,
        txid
      );

      await this.deliverProduct(payment);

      res.json({ success: true, paymentId, txid });
    } catch (error) {
      console.error('[PaymentController] Complete failed:', error);
      res.status(500).json({ error: 'Failed to complete payment' });
    }
  };

  private async deliverProduct(payment: Payment): Promise<void> {
    console.log(`[Business Logic] Delivering product for payment ${payment.id}`);
    
    try {
        const user = await this.userRepository.findById(payment.userId);
        if (!user) return;

        const { type, itemId } = payment.metadata;

        if (type === 'license' && itemId) {
            console.log(`Granting License ${itemId} to user ${user.username}`);

            // 1. Grant Inventory Item
            const newItem = { 
                itemId: itemId, 
                acquiredDate: Date.now(), 
                active: true,
                source: 'pi_network_payment',
                paymentId: payment.id
            };
            
            // Deduplicate
            const existingIndex = user.inventory.findIndex(i => i.itemId === itemId);
            if (existingIndex >= 0) {
                user.inventory[existingIndex] = newItem; // Upgrade/Refresh
            } else {
                user.inventory.push(newItem);
            }

            // 2. CASHBACK LOGIC (10%)
            const cashback = payment.amount * 0.10;
            user.transferableBalance = (user.transferableBalance || 0) + cashback;
            
            // 3. PERSIST (With Lazy Migration)
            try {
                await this.userRepository.save(user);
            } catch (error: any) {
                // Check for "column does not exist" error (Postgres code 42703)
                if (error.message.includes('inventory') || error.message.includes('transferable_balance')) {
                    console.warn("Missing columns detected. Running Lazy Migration...");
                    const db = Database.getInstance();
                    await db.query(`
                        ALTER TABLE users 
                        ADD COLUMN IF NOT EXISTS inventory JSONB DEFAULT '[]'::jsonb,
                        ADD COLUMN IF NOT EXISTS transferable_balance DECIMAL(18, 8) DEFAULT 0;
                    `);
                    // Retry save
                    await this.userRepository.save(user);
                } else {
                    throw error;
                }
            }
            
            console.log(`License granted + Cashback ${cashback} Pi to transferable balance.`);
            console.log(`License granted + Cashback ${cashback} Pi to transferable balance.`);
        } 
        else if (type === 'shop_item' && itemId) {
             console.log(`Delivering Shop Item ${itemId} to user ${user.username}`);
             
             // Energy Logic - Align with shopContent.ts values
             if (itemId === 'energy_small') user.energyBalance += 50;
             else if (itemId === 'energy_medium') user.energyBalance += 120;
             else if (itemId === 'energy_large') user.energyBalance += 250; 
             else if (itemId === 'energy_full') user.energyBalance = 500; // Full battery = 500 energy points
             
             // Inventory Logic (Boosters)
             else {
                 const newItem = { 
                    itemId: itemId, 
                    acquiredDate: Date.now(), 
                    active: true,
                    source: 'mainnet_purchase',
                    paymentId: payment.id
                 };
                 // Deduplicate or Stack?
                 // Most items are consumable or stacks. For simplicity, just push.
                 user.inventory.push(newItem);
             }

             await this.userRepository.save(user);
             console.log(`Shop Item ${itemId} delivered.`);
        }
    } catch (error) {
        console.error('[PaymentController] Delivery Failed:', error);
        // We log but don't fail the HTTP request as payment is already completed on Blockchain.
        // Needs manual reconciliation if this fails reliably.
    }
  }

  getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;

      const payments = await this.paymentRepository.findByUserId(userId, limit);

      res.json({
        success: true,
        payments: payments.map(p => ({
          id: p.id,
          amount: p.amount,
          memo: p.memo,
          status: p.status,
          direction: p.direction,
          txid: p.txid,
          createdAt: p.createdAt
        }))
      });
    } catch (error) {
      console.error('[PaymentController] Get history failed:', error);
      res.status(500).json({ error: 'Failed to retrieve payment history' });
    }
  };
}
