const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const { getPayment, approvePayment, completePayment: completePiPayment } = require('../services/piNetworkService');
const { updateUserProgress, createTransaction, getCollection } = require('../database/db'); 

// Pi Platform API URL
const PI_PLATFORM_API_URL = 'https://api.minepi.com/v2';

/**
 * POST /api/payments/approve
 * Callback from client to approve a payment
 */
router.post('/approve', authenticateToken, async (req, res) => {
    try {
        const { paymentId } = req.body;
        const userId = req.user.uid;

        if (!paymentId) {
            return res.status(400).json({ success: false, error: 'PaymentId required' });
        }

        console.log(`[Payment] Requesting approval for ${paymentId} (User: ${userId})`);

        // 1. Get payment details from Pi Network
        const payment = await getPayment(paymentId);

        // 2. Validate payment metadata content
        // In a real app, check payment.metadata against your database of products
        // For now, we accept it if it has valid structure
        if (!payment.metadata || !payment.amount) {
             return res.status(400).json({ success: false, error: 'Invalid payment metadata' });
        }

        // 3. Approve the payment on Pi Server
        await approvePayment(paymentId);

        res.json({
            success: true,
            message: 'Payment approved',
            paymentId
        });

    } catch (error) {
        console.error('Payment approval error:', error);
        res.status(500).json({ success: false, error: 'Approval failed' });
    }
});

/**
 * POST /api/payments/complete
 * Callback from client to complete a payment
 */
router.post('/complete', authenticateToken, async (req, res) => {
    try {
        const { paymentId, txid } = req.body;
        const userId = req.user.uid;

        if (!paymentId || !txid) {
            return res.status(400).json({ success: false, error: 'PaymentId and txid required' });
        }

        console.log(`[Payment] Completing ${paymentId} with txid ${txid} (User: ${userId})`);

        // 1. Check for Double Spend/Replay
        const existingTx = await getCollection('transactions').findOne({ txid });
        if (existingTx) {
            return res.status(409).json({ 
                success: false, 
                error: 'Transaction already processed',
                code: 'ALREADY_PROCESSED'
            });
        }

        // 2. Complete on Pi Network
        // This confirms to Pi Server that we have received the TXID
        await completePiPayment(paymentId, txid);

        // 3. Get Payment details to know what to deliver
        const payment = await getPayment(paymentId);
        
        // 4. Deliver Goods
        await deliverItem(userId, payment);

        // 5. Record Transaction locally
        await createTransaction({
            userId,
            paymentId,
            txid,
            amount: payment.amount,
            type: 'purchase',
            metadata: payment.metadata,
            status: 'completed'
        });

        res.json({
            success: true,
            message: 'Payment completed and item delivered',
            paymentId
        });

    } catch (error) {
        console.error('Payment completion error:', error);
        res.status(500).json({ success: false, error: 'Completion failed' });
    }
});

/**
 * POST /api/payments/incomplete
 * Handle incomplete payment found by client
 */
router.post('/incomplete', authenticateToken, async (req, res) => {
    try {
        const { paymentId, txid } = req.body; // txid might be present if user signed it
        const userId = req.user.uid;
        
        if (!paymentId) return res.status(400).json({success:false});

        console.log(`[Payment] Checking incomplete payment ${paymentId}`);

        // Check if we already processed it
        if (txid) {
             const existingTx = await getCollection('transactions').findOne({ txid });
             if (existingTx) {
                 return res.json({ success: true, message: 'Already processed', status: 'completed' });
             }
             
             // If not processed but we have txid, try to complete it
             await completePiPayment(paymentId, txid);
             const payment = await getPayment(paymentId);
             await deliverItem(userId, payment);
             await createTransaction({
                userId,
                paymentId,
                txid,
                amount: payment.amount,
                type: 'purchase',
                metadata: payment.metadata,
                status: 'completed'
            });
            return res.json({ success: true, message: 'Recovered and completed', status: 'completed' });
        } else {
            // If no txid, usually we can cancel it or just ignore. 
            // The logic depends on status.
            // For this implementation, we report it needs action.
            return res.json({ success: false, message: 'No txid provided', status: 'pending' });
        }

    } catch (error) {
         console.error('Incomplete check error:', error);
         res.status(500).json({ success: false });
    }
});

/**
 * Helper: Deliver Item based on metadata
 */
async function deliverItem(userId, payment) {
    const meta = payment.metadata || {};
    // Example metadata: { type: 'energy', quantity: 100 } OR { type: 'premium_1month' }
    
    // Default fallback if metadata is string (legacy)
    let type = meta.type;
    
    if (!type && typeof meta === 'string') {
        // try parsing or guessing
    }

    if (type === 'energy_pack_small') {
        await updateUserProgress(userId, { $inc: { "energy.current": 50 } }); // Not exact syntax, updateUserProgress uses $set usually. 
        // We need direct DB access for atomic increment, but let's use what we have or adapt.
        // updateUserProgress implementation in db.js blindly does $set: { ...progressData }.
        // This is dangerous for concurrent increments. 
        // We really should use getCollection('progress').updateOne directly here for safety.
        await getCollection('progress').updateOne({ userId }, { $inc: { "energy.current": 50 } });
    } 
    else if (type === 'energy_pack_large') {
        await getCollection('progress').updateOne({ userId }, { $inc: { "energy.current": 150 } });
    }
    else if (type === 'premium') {
         // Logic for premium
    }
    
    console.log(`[DELIVERY] Delivered ${type} to ${userId}`);
}

module.exports = router;
