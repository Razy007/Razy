import express from 'express';
import { body, validationResult } from 'express-validator';
import * as StellarSdk from 'stellar-sdk';
import Database from '../config/database'; 

import { authenticateToken } from '../presentation/middlewares/authentication';

const router = express.Router();
const pool = Database.getInstance().pool;

// Initialize Stellar SDK Servers
const testnetServer = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const mainnetServer = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

/**
 * @route POST /api/wallet/validate
 * @desc Validate a Stellar/Pi wallet address via Horizon
 * @access Private
 */
router.post(
    '/validate',
    authenticateToken,
    [
        body('address').isString().isLength({ min: 56, max: 56 }).withMessage('Adresse invalide'),
        body('network').isIn(['testnet', 'mainnet']).withMessage('Réseau invalide'),
    ],
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ valid: false, message: errors.array()[0].msg });
        }

        const { address, network } = req.body;
        const server = network === 'mainnet' ? mainnetServer : testnetServer;

        try {
            // Check if account exists on ledger
            const account = await server.loadAccount(address);
            res.json({ 
                valid: true, 
                network, 
                balance: account.balances.find((b: any) => b.asset_type === 'native')?.balance || '0'
            });
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                // Valid format but account not funded/created on ledger yet
                // For Pi Network, new wallets might not be on Horizon until funded.
                // However, we technically consider it "valid format" but "inactive".
                // For stricter security, we might require it to be active.
                return res.json({ valid: true, status: 'inactive', message: 'Adresse valide mais compte inactif sur la blockchain.' });
            }
            console.error('Horizon error:', error);
            res.status(502).json({ valid: false, message: 'Erreur de connexion à la blockchain' });
        }
    }
);

/**
 * @route POST /api/wallet/save
 * @desc Save validated wallet to user profile
 * @access Private
 */
router.post(
    '/save',
    authenticateToken,
    [
        body('address').matches(/^G[A-Z0-9]{55}$/),
        body('network').isIn(['testnet', 'mainnet'])
    ],
    async (req: any, res: any) => {
        // Use piUserId from token (mapped in auth middleware)
        const userId = req.user?.piUserId;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { address, network } = req.body;

        try {
            await pool.query(
                `INSERT INTO user_wallets (user_id, public_key, network)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (user_id) 
                 DO UPDATE SET public_key = EXCLUDED.public_key, network = EXCLUDED.network, updated_at = NOW()`,
                [userId, address, network]
            );
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    }
);

export default router;
