import { getAsync, runAsync, allAsync } from '../db.js';

export async function getBalance(req, res) {
  try {
    const user = await getAsync(
      `SELECT balance FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getTransactionHistory(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const transactions = await allAsync(
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );

    const countResult = await getAsync(
      `SELECT COUNT(*) as total FROM transactions WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({
      transactions,
      total: countResult.total,
      limit,
      offset
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getGameHistory(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const history = await allAsync(
      `SELECT * FROM game_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );

    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateBalance(userId, amount) {
  try {
    await runAsync(
      `UPDATE users SET balance = balance + ? WHERE id = ?`,
      [amount, userId]
    );
  } catch (error) {
    throw error;
  }
}
