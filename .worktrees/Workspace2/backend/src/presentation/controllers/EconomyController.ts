import { Request, Response } from 'express';
import Database from '../../config/database';

export class EconomyController {
  
  /**
   * Request a withdrawal
   * POST /api/economy/withdraw
   */
  static async requestWithdrawal(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const { amount, walletAddress } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Montant invalide' });
      }
      if (!walletAddress) {
        return res.status(400).json({ message: 'Adresse wallet requise' });
      }

      const db = Database.getInstance();
      const client = await db.getClient();

      try {
        await client.query('BEGIN');

        // 1. Fetch User & Lock
        // Note: We search by pi_id because uid from token is pi_id
        const userRes = await client.query('SELECT id, mainnet_balance FROM users WHERE pi_id = $1 FOR UPDATE', [uid]);
        const user = userRes.rows[0];

        if (!user) {
           await client.query('ROLLBACK');
           return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const currentBalance = parseFloat(user.mainnet_balance || '0');
        if (currentBalance < amount) {
           await client.query('ROLLBACK');
           return res.status(400).json({ message: 'Solde Mainnet insuffisant pour le retrait' });
        }

        // 2. Prevent duplicate pending requests
        const pendingRes = await client.query(
            "SELECT 1 FROM withdrawal_requests WHERE user_id = $1 AND status = 'pending'", 
            [uid]
        );
        if (pendingRes.rowCount && pendingRes.rowCount > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Une demande de retrait est déjà en cours.' });
        }

        // 3. Deduct Balance immediately from mainnet_balance
        await client.query(
            'UPDATE users SET mainnet_balance = mainnet_balance - $1 WHERE id = $2',
            [amount, user.id]
        );

        // 4. Create Request
        const insertRes = await client.query(
            `INSERT INTO withdrawal_requests (user_id, amount, wallet_address, status) 
             VALUES ($1, $2, $3, 'pending') RETURNING id, status, created_at`,
            [uid, amount, walletAddress]
        );

        await client.query('COMMIT');

        return res.status(201).json({ 
          message: 'Demande de retrait envoyée avec succès',
          request: { _id: insertRes.rows[0].id } 
        });

      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Withdrawal Error:', error);
      return res.status(500).json({ message: 'Erreur lors de la demande de retrait' });
    }
  }

  /**
   * Get user withdrawal history
   * GET /api/economy/withdrawals
   */
  static async getWithdrawalHistory(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const db = Database.getInstance();
      
      const result = await db.query(
          "SELECT * FROM withdrawal_requests WHERE user_id = $1 ORDER BY created_at DESC", 
          [uid]
      );
      
      return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  /**
   * Purchase an item from the shop
   * POST /api/economy/purchase
   */
  static async purchaseItem(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const { itemId, cost, credibilityScore } = req.body;

      if (!itemId || cost === undefined || cost < 0) {
        return res.status(400).json({ success: false, message: 'Paramètres invalides' });
      }

      const db = Database.getInstance();
      const client = await db.getClient();

      try {
        await client.query('BEGIN');

        // 1. Fetch User & Lock
        const userRes = await client.query(
          'SELECT id, pi_balance, inventory FROM users WHERE pi_id = $1 FOR UPDATE', 
          [uid]
        );
        const user = userRes.rows[0];

        if (!user) {
          await client.query('ROLLBACK');
          return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const currentBalance = parseFloat(user.pi_balance || '0');
        if (currentBalance < cost) {
          await client.query('ROLLBACK');
          return res.status(400).json({ 
            success: false, 
            message: 'Solde insuffisant',
            required: cost,
            available: currentBalance
          });
        }

        // 2. Update balance and inventory
        const currentInventory = user.inventory || [];
        const newInventory = [...currentInventory, {
          itemId,
          acquiredDate: Date.now(),
          active: true
        }];

        await client.query(
          `UPDATE users SET 
            pi_balance = pi_balance - $1,
            inventory = $2
          WHERE id = $3`,
          [cost, JSON.stringify(newInventory), user.id]
        );

        // 3. Record transaction
        await client.query(
          `INSERT INTO transactions (user_id, type, amount, description, created_at)
           VALUES ($1, 'purchase', $2, $3, NOW())`,
          [user.id, -cost, `Achat: ${itemId}`]
        );

        await client.query('COMMIT');

        // Fetch updated user
        const updatedUserRes = await db.query(
          'SELECT pi_balance, inventory FROM users WHERE id = $1',
          [user.id]
        );

        return res.status(200).json({
          success: true,
          message: `Achat réussi ! Crédibilité +${credibilityScore || 0}`,
          newBalance: parseFloat(updatedUserRes.rows[0]?.pi_balance || '0'),
          inventory: updatedUserRes.rows[0]?.inventory || []
        });

      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

    } catch (error) {
      console.error('Purchase Error:', error);
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'achat' });
    }
  }
}
